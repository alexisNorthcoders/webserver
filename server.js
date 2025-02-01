const express = require('express')
const path = require('path');
const { getScore, addScore } = require('./redis');
const app = express()
const { systemInfo } = require('./models')


let players = {};

const ALLOWED_IPS = ["127.0.0.1", "::1"]; 

// only localhost middleware
const localhostOnly = (req, res, next) => {
  const ip = req.socket.remoteAddress;
  if (!ALLOWED_IPS.includes(ip)) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};


app.use(express.json())
app.use("/snake", express.static(path.join(__dirname, '/public')));
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleString();
  const { method, url } = req

  console.log(`[${timestamp}] | ${method} | ${url} | user-agent: ${JSON.stringify(req.headers['user-agent'])} | Body: ${JSON.stringify(req.body)}`);
  next();
});
app.use("/snake", express.static(path.join(__dirname, '../p5')));
app.use("/zigzag", express.static(path.join(__dirname, '../zigzag-game')));
app.use(
  "/kings-and-pigs",
  express.static(path.join(__dirname, '../Platformer-Game'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {

        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      } else {

        res.setHeader('Cache-Control', 'public, max-age=604800');
      }
    }
  })
);

app.post("/system-info", localhostOnly, (req, res) => {
  const { temperature, cpuUsage, memoryUsage, diskUsage, diskActivity } = req.body;

  if (!temperature || !cpuUsage || !memoryUsage || !diskUsage || !diskActivity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  systemInfo.addRecord(temperature, cpuUsage, memoryUsage, diskUsage, diskActivity, (err, id) => {
    if (err) {
      return res.status(500).json({ error: "Failed to insert record" });
    }
    res.status(201).json({ message: "Record added successfully", recordId: id });
  });
});

app.get("/system-info", (req, res) => {
  systemInfo.getLast20Records((err, records) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve records" });
    }
    res.json(records);
  });
});


const allowedOrigin = [
  "http://raspberrypi.local:7000",
  "https://alexisraspberry.duckdns.org"
];

app.post("/zigzag/score", (req, res, next) => {
  const origin = req.headers.origin || req.headers.referer;

  if (!origin || !allowedOrigin.some(allowed => origin.startsWith(allowed))) {
    return res.status(403).json({ error: "Invalid origin or referer" });
  }

  next();
});

app.post("/zigzag/score", async (req, res) => {

  const { score } = req.body;

  if (!score) {
    return res.status(400).json({ error: "Score is required" });
  }

  try {
    await addScore('zigzag_highscore', score);
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}]RES { message: Highscore added: ${score}`);
    res.status(201).json({ message: `Highscore added: ${score}` });
  } catch (err) {

    res.status(500).json({ error: "Error adding score" });
  }
});

app.get("/zigzag/score", async (req, res) => {

  try {
    const scores = await getScore("zigzag_highscore");

    const last10Scores = scores.slice(-10);

    res.status(200).json(last10Scores);
  } catch (err) {
    res.status(500).json({ err });
  }
});

app.get("/snake/score/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const score = await getScore(userId);
    res.status(200).json(score);
  } catch (err) {
    res.status(500).json({ err });
  }
});

app.post("/snake/score/:userId", async (req, res) => {
  const { userId } = req.params;
  const { score } = req.body;

  if (!score) {
    return res.status(400).json({ error: "Score is required" });
  }

  try {
    await addScore(userId, score);
    res.status(201).json({ message: `Score of ${score} added for user ${userId}` });
  } catch (err) {
    res.status(500).json({ error: "Error adding score" });
  }
});
module.exports = { app }