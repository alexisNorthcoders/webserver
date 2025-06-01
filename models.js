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
class AmazonPriceTracker {
    addPriceRecord(url, title, price, timestamp, callback) {
        const query = `
            INSERT INTO amazon_prices (url, title, price, timestamp)
            VALUES (?, ?, ?, ?)
        `;
        db.run(query, [url, title, price, timestamp], function (err) {
            if (err) {
                Logger.logMessage(`Database: amazon_prices | Error inserting record: ${JSON.stringify(err)}`);
                callback(err);
            } else {
                Logger.logMessage(`Database: amazon_prices | Record inserted with ID: ${this.lastID}`);
                callback(null, this.lastID);
            }
        });
    }

    async getLastPrice(url, callback) {
        const query = `
            SELECT price FROM amazon_prices
            WHERE url = ?
            ORDER BY timestamp DESC
            LIMIT 1
        `;
        db.get(query, [url], (err, row) => {
            if (err) {
                Logger.logMessage(`Database: amazon_prices | Error fetching last price: ${JSON.stringify(err)}`);
                callback(err);
            } else {
                callback(null, row ? row.price : null);
            }
        });
    }
}


module.exports = {
    systemInfo: new SystemInfo(),
    amazonPriceTracker: new AmazonPriceTracker()
};
