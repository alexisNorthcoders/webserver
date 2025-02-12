const redis = require("redis");
const Logger = require('./logger')
const redisClient = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
});

redisClient.connect();

redisClient.on("connect", () => {

  Logger.logMessage("Redis: Connected to Redis")
});
redisClient.on("error", (err) => {
  Logger.logMessage(`Redis: error: ${JSON.stringify(err)}`)
});

async function addScore(userId, score) {
  try {
    await redisClient.zAdd(`user:${userId}:scores`, { score: parseInt(score), value: Date.now().toString() });
    Logger.logMessage(`Redis: Score ${score} added for user ${userId}`)

  } catch (err) {
    Logger.logMessage(`Redis: Error adding scores: ${JSON.stringify(err)}`)
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
    Logger.logMessage(`Redis: Error retrieving scores: ${JSON.stringify(err)}`)
    throw err;
  }
}

async function deleteAllScores() {
  try {
    const keys = await redisClient.keys("user:*:scores");
    if (keys.length > 0) {
      await redisClient.del(keys);
      Logger.logMessage(`Redis: All user scores deleted.`)
    } else {
      Logger.logMessage(`Redis: No user scores found to delete.`)
    }
  } catch (err) {
    Logger.logMessage(`Redis: Error deleting all scores: ${JSON.stringify(err)}`)
  }
}

module.exports = { addScore, getScore, deleteAllScores, redisClient };
