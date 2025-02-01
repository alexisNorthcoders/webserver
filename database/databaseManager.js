const sqlite3 = require("sqlite3")

async function initializeDatabase(callback) {
  const db = new sqlite3.Database("../../clipboard/DB/database.sqlite", (err) => {
    if (err) {
      console.error("Error opening database", err.message);
      if (callback) callback(err);
      return;
    }

    db.serialize(() => {
      db.run("DROP TABLE IF EXISTS system_info", function (err) {
        if (err) {
          console.error("Error dropping system_info table", err.message);
          if (callback) callback(err);
          return;
        }
        db.run(`CREATE TABLE system_info (
                  id SERIAL PRIMARY KEY,
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
            console.error("Error creating users table", err.message);
            if (callback) callback(err);
            return;
          }

          if (callback) callback(null);
        });
      });
    });
  });
}

module.exports = { initializeDatabase };
