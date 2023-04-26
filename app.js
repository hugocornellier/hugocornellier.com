const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const requestIp = require('request-ip')
const logger = require('./client/js/logger.js')

app.use(express.static(__dirname))
app.get('/', async (req, res) => {
	logger.insertViewToDb(requestIp.getClientIp(req))
	res.sendFile(__dirname + "/client/hugocornellier.html")
})
app.get('/projects/*', (req, res) => {
	res.sendFile(__dirname + "/client/projects/*/index.html")
})

io.on('connection', (socket) => {
	socket.on('image', (dataRefs) => {
		console.log("User has uploaded new image");
	});
});

// Local env port to 3000 & live env port to 5000
let port = app.settings['views'].substring(0, 5) === "/User" ? 3000 : 5000
server.listen(port, () =>
	console.log(`Example app listening on port ` + port)
)
