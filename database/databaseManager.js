const sqlite3 = require('sqlite3').verbose();

async function initializeDatabase(callback) {
  const db = new sqlite3.Database("../../clipboard/DB/database.sqlite", (err) => {
    if (err) {
      console.error("Error opening database", err.message);
      if (callback) callback(err);
      return;
    }

    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS system_info (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                temperature FLOAT,
                cpu_usage FLOAT,
                memory_used FLOAT,
                memory_total FLOAT,
                disk_used FLOAT,
                disk_available FLOAT,
                disk_read_speed FLOAT,
                disk_write_speed FLOAT
              )`, function (err) {
        if (err) {
          console.error("Error creating system_info table", err.message);
          if (callback) callback(err);
          return;
        }

        db.run(`CREATE TABLE IF NOT EXISTS amazon_prices (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  url TEXT NOT NULL,
                  title TEXT NOT NULL,
                  price TEXT NOT NULL,
                  timestamp TEXT NOT NULL
                )`, function (err) {
          if (err) {
            console.error("Error creating amazon_prices table", err.message);
            if (callback) callback(err);
            return;
          }

          console.log("✅ Tables initialized successfully.");
          if (callback) callback(null);
        });
      });
    });
  });
}

module.exports = { initializeDatabase };
