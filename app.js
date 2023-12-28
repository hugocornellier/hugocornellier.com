const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors');
app.use(cors({
	origin: ['https://www.thecabindepot.com', 'https://www.thecabindepot.ca']
}));
const server = http.createServer(app)
const io = new Server(server)
const { MongoClient } = require("mongodb");
let pw = encodeURIComponent("+z:~hu2z._pC98u")
const uri = `mongodb+srv://hugocornellier:${pw}@leaderboard.qrubtzl.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri)

async function insertLeaderboardListing(score, name) {
	const database = client.db("LDB")
	const ldb = database.collection("leaderboard")
	const result = await ldb.insertOne({
		score: score,
		name: name,
	})
	socket.emit('entry_added', result)
}

app.use(express.static(__dirname))
app.get('/', async (req, res) => {
	res.sendFile(__dirname + "/client/hugocornellier.html")
})
app.get('/projects/*/', (req, res) => {
	res.sendFile(__dirname + "/projects/*/index.html")
})

io.on('connection', (socket) => {
	socket.on('join_leaderboard', async (data) => {
		let score = data[0]
		let name = data[1]
		console.log(`new high score. ${score} by ${name}`)
		insertLeaderboardListing().catch(console.dir);
		socket.emit('entry_added', "success")
	})
})

// Local env port to 3000 & live env port to 5000
let port = app.settings['views'].substring(0, 5) === "/User" ? 3000 : 5000
server.listen(port, () =>
	console.log(`Example app listening on port ` + port)
)
