const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../clipboard/DB/database.sqlite");

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
                console.log(`Record inserted with ID: ${this.lastID}`);
                callback(null, this.lastID);
            }
        });
    }
    getLast20Records(callback) {
        const query = `
            SELECT * FROM system_info
            ORDER BY timestamp DESC
            LIMIT 20`;
        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error retrieving records:', err);
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