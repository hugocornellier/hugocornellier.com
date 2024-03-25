const db_conn = require("./db_conn")

module.exports = {

    createTable: function createTable() {
        console.log("Here")
        db_conn.exec(`
            CREATE TABLE views (
                date VARCHAR(150),
                timestamp VARCHAR(150),
                page VARCHAR(150),
                ip VARCHAR(50),
                country VARCHAR(150),
                region VARCHAR(150),
                timezone VARCHAR(150),
                city VARCHAR(150),
                userAgent VARCHAR(150)
            )
        `)
    },

    deleteTable: async function deleteTable(table) {
        if (await this.checkIfTableExists(table)) {
            db_conn.exec(`
                DROP TABLE ${table}
            `)
        }
    },

    checkIfTableExists: async function checkIfTableExists(tableName) {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`,
                (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve((rows.length > 0));
                }
            )
        })
    },

    insertEntry: async function insertEntry(row, table) {
        return new Promise(async (resolve, reject) => {
            const columns = ['date', 'timestamp', 'page', 'ip', 'country', 'region', 'timezone', 'city', 'userAgent'];
            const insertQuery = `
                INSERT INTO ${table} (${columns.join(', ')}) 
                VALUES (${Array(columns.length).fill('?').join(', ')})
            `;
            const insertValues = columns.map(col => row[col]);
            console.log("Inserting...")
            db_conn.run(insertQuery, insertValues, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`Inserted a row.`);
                    resolve();
                }
            });
        })
    },

    getRecords: async function getRecords(table) {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                FROM ${table}
                ORDER BY timestamp DESC`,
                [], (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                }
            )
        })
    }
}