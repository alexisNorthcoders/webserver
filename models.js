const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../clipboard/DB/database.sqlite");
const Logger = require('./logger')

class SystemInfo {
    addRecord(temperature, cpuUsage, memoryUsage, diskUsage, diskActivity, callback) {

        const query = `
            INSERT INTO system_info (temperature, cpu_usage, memory_used, memory_total, disk_used, disk_available, disk_read_speed, disk_write_speed)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            temperature,
            cpuUsage,
            memoryUsage.usedMemory,
            memoryUsage.totalMemory,
            diskUsage.used,
            diskUsage.available,
            diskActivity.readSpeed,
            diskActivity.writeSpeed
        ];

        db.run(query, values, function (err) {
            if (err) {
                console.error('Error inserting record:', err);
                callback(err);
            } else {

                Logger.logMessage(`Database: system_info | Record inserted with ID: ${this.lastID}`)
                callback(null, this.lastID);
            }
        });
    }
    getLastRecords(limit, callback) {
        const query = `
            SELECT * FROM system_info
            ORDER BY timestamp DESC
            LIMIT ${limit}`;
        db.all(query, [], (err, rows) => {
            if (err) {
                Logger.logMessage(`Database: system_info | Error retrieving records: ${JSON.stringify(err)}`)
                callback(err);
            } else {
                callback(null, rows);
            }
        });
    }
    getLast100Records(callback) {
        const query = `
            SELECT * FROM system_info
            ORDER BY timestamp DESC
            LIMIT 100`;
        db.all(query, [], (err, rows) => {
            if (err) {
                Logger.logMessage(`Database: system_info | Error retrieving records: ${JSON.stringify(err)}`)
                callback(err);
            } else {
                callback(null, rows);
            }
        });
    }
}

module.exports = {
    systemInfo: new SystemInfo()
};
