const db_conn = require("./db_conn")

module.exports = {

    createTable: function createTable() {
        console.log("Here")
        db_conn.exec(`
            CREATE TABLE views (
                date VARCHAR(150),
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
            const columns = ['date', 'ip', 'country', 'region', 'timezone', 'city', 'userAgent'];
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

    getEntry: async function getEntry(row, table) {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                    FROM ${table} 
                    WHERE date = ? 
                    AND player = ? 
                    AND lap1 = ? 
                    AND lap2 = ? 
                    AND lap3 = ? 
                    AND coins = ? 
                    AND shrooms = ? 
                    AND character = ? 
                    AND kart = ? 
                    AND tires = ? 
                    AND glider = ? 
                    AND time = ? 
                    AND video_url = ? 
                    AND controller = ? 
                    AND nation = ? 
                    AND race = ? 
                    AND cc = ?`,
                [row['date'], row['player'], row['lap1'], row['lap2'], row['lap3'], row['coins'],
                    row['shrooms'], row['character'], row['kart'], row['tires'], row['glider'], row['time'],
                    row['video_url'], row['controller'], row['nation'], row['race'], row['cc']],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                }
            )
        })
    },

    getAllEntriesByRace: async function getAllEntriesByRace(race, table, cc) {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                FROM ${table} 
                WHERE race = ?
                AND cc = ? 
                ORDER BY time ASC`,
                [race, cc],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                }
            )
        })
    },

    deleteAllByRaceId: async function deleteAllByRaceId(race_id, table) {
        return new Promise((resolve, reject) => {
            db_conn.exec(
                `DELETE 
                FROM ${table} 
                WHERE race_id = '${race_id}'`,
                (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                }
            )
        })
    },

    getAllEntriesByPlayer: async function getAllEntriesByPlayer(player, table) {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                FROM ${table} 
                WHERE player = ?
                ORDER BY date DESC, time ASC`,
                [player],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                }
            )
        })
    },

    getRecords: async function getRecords(table) {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                FROM ${table}
                ORDER BY date DESC`,
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