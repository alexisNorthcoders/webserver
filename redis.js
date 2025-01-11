const redis = require("redis");
const redisClient = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
});

redisClient.connect();

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

async function addScore(userId, score) {
  try {
    await redisClient.zAdd(`user:${userId}:scores`, { score: parseInt(score), value: Date.now().toString() });
    console.log(`Score ${score} added for user ${userId}`);
  } catch (err) {
    console.error("Error adding score to user:", err);
  }
}

async function getScore(userId) {
  try {
    const scores = await redisClient.zRangeWithScores(`user:${userId}:scores`, 0, -1);
    return scores.map((scoreObj) => ({
      score: scoreObj.score,
      timestamp: new Date(parseInt(scoreObj.value)).toISOString(),
    }));
  } catch (err) {
    console.error("Error retrieving scores for user:", err);
    throw err;
  }
}

async function deleteAllScores() {
  try {
    const keys = await redisClient.keys("user:*:scores");
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log("All user scores deleted.");
    } else {
      console.log("No user scores found to delete.");
    }
  } catch (err) {
    console.error("Error deleting all scores:", err);
  }
}

module.exports = { addScore, getScore, deleteAllScores, redisClient };
