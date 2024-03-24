const http = require("http")
const express = require("express")
const socketIO = require("socket.io")
const geoip = require('geoip-lite');
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
    socket.on("get_records", async () => {
        io.emit("get_records_ret", await db.getRecords('views'));
    })
    socket.on("track_view_data", async () => {
        const headers = socket.conn.request.rawHeaders;
        let requestIP = null;
        let userAgent = null;

        for (let i = 0; i < headers.length; i += 2) {
            if (headers[i] === 'X-Real-IP') {
                requestIP = headers[i + 1];
            } else if (headers[i] === 'User-Agent') {
                userAgent = headers[i + 1];
            }
        }

        requestIP ??= "173.34.38.168";
        userAgent ??= "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:124.0) Gecko/20100101 Firefox/124.0";

        const geo = geoip.lookup(requestIP);

        const row = {
            'date': String(new Date()),
            'ip': requestIP,
            'country': geo.country,
            'region': geo.region,
            'timezone': geo.timezone,
            'city': geo.city,
            'userAgent': userAgent
        };

        if (!(await db.checkIfTableExists('views'))) {
            db.createTable();
        }

        db.insertEntry(row, 'views');
    });

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