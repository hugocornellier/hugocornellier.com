const http = require("http")
const express = require("express")
const socketIO = require("socket.io")
const geoip = require('geoip-lite');
const app = express()
const path = require('path')
const uaParser = require('ua-parser-js');
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
    socket.on("track_view_data", async (page) => {
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

        const ua = uaParser(userAgent);
        const browser = ua.browser.name + " " + ua.browser.version
        const os = ua.os.name + " " + ua.os.version
        const device = ua.device.vendor + " " + ua.device.model
        console.log("\nBrowser:", browser)
        console.log("OS:", os)
        console.log("Device:", device)

        const geo = geoip.lookup(requestIP);
        const date = new Date();
        const options = {
            timeZone: 'America/Halifax', // Atlantic timezone
            weekday: 'short', // Abbreviated weekday name (e.g., Tue)
            month: 'short', // Abbreviated month name (e.g., Apr)
            day: '2-digit', // Day of the month (e.g., 02)
            year: 'numeric', // Full year (e.g., 2024)
            hour12: false, // Use 24-hour format
            hour: '2-digit', // Hour (e.g., 09)
            minute: '2-digit', // Minute (e.g., 37)
            second: '2-digit' // Second (e.g., 15)
        };

        const formattedDate = date.toLocaleString('en-US', options);

        const row = {
            'date': String(formattedDate),
            'timestamp': String((new Date).getTime()),
            'page': page,
            'ip': requestIP,
            'country': geo.country,
            'region': geo.region,
            'timezone': geo.timezone,
            'city': geo.city,
            'userAgent': userAgent,
            'browser': browser,
            'os': os,
            'device': device
        };

        const tableExists = await db.checkIfTableExists('views')
        if (!tableExists) {
            db.createTable();
        }

        db.insertEntry(row, 'views');
    });

    // Handle disconnect event
    socket.on("disconnect", () => {
        console.log("User disconnected");
        // Additional cleanup or handling can be done here if needed
    });
});

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