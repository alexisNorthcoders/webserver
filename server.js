const express = require('express')
const path = require('path');
const { getScore, addScore } = require('./redis');
const app = express()
const Logger = require('./logger')

app.use(express.json())
app.use(Logger.logRequest);
app.use("/snake", express.static(path.join(__dirname, '/public')));

app.use("/snake", express.static(path.join(__dirname, '../p5')));

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
