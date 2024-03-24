const http = require("http")
const express = require("express")
const socketIO = require("socket.io")
const app = express()
const path = require('path')
const server = http.createServer(app)
const io = socketIO(server)
const db = require("./db/db")

app.use(express.static(path.join(__dirname, "../frontend/build")))
app.get("*", (req, res) => {
    res.sendFile("index.html", {root: "frontend/build"});
});

io.on("connection", (socket) => {
    console.log("Socket.io connection made successfully.");
    socket.on("get_race_data", async (race, game, cc) => {
        io.emit("get_race_data_ret", await db.getAllEntriesByRace(race, game, cc));
    })
    socket.on("get_player_data", async (player, game) => {
        io.emit("get_player_data_ret", await db.getAllEntriesByPlayer(decodeURI(player), game), await db.getRecords(game));
    })
    socket.on("get_records", async (table, cc) => {
        io.emit("get_records_ret", await db.getRecords(table, cc));
    })
    socket.on("track_view_data", async (table, cc) => {
        console.log("Tracking view data...")
        const rawHeaders = socket.conn.request.rawHeaders
        let requestIP = null
        for (let i= 0; i < rawHeaders.length; i = i + 2) {
            console.log(rawHeaders[i] + ": " + rawHeaders[i + 1])
            requestIP = (rawHeaders[i] === 'X-Real-IP') ? rawHeaders[i + 1] : null
        }
        console.log(requestIP)
    })
})

let home_path = app.settings['views'].substring(0, 5)
const port = home_path === "/User" || home_path === "C:\\Us"
    ? 4000
    : 5000
server.listen(
    port,
    async () => {
        return new Promise(async (resolve) => {
            console.log(`Server running!`)
            resolve()
        })
    }
)