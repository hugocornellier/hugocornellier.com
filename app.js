const express = require('express')
const app = express()
const http = require('http')
const { sha512 } = require('js-sha512');
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

async function insertLeaderboardListing(score, name, socket) {
	console.log("attempting to insert listing")
	const database = client.db("LDB")
	const ldb = database.collection("leaderboard")
	const result = await ldb.insertOne({
		score: score,
		name: name,
	})
	socket.emit('entry_added', result)
}

async function getLeaderboardData(socket) {
	console.log("attempting to get lb data")
	const database = client.db("LDB")
	const ldb = database.collection("leaderboard")
	const result = await ldb.find().sort( { score: -1 } ).toArray()
	let results = []
	result.forEach(doc => {
		results.push({
			"name": doc.name,
			"score": doc.score
		})
	});
	console.log(results)
	socket.emit('lb_data', results)
}

app.use(express.static(__dirname))
app.get('/', async (req, res) => {
	res.sendFile(__dirname + "/client/hugocornellier.html")
})
app.get('/projects/dealer_portal/', (req, res) => {
	res.sendFile(__dirname + "/projects/dealer_portal/index.html")
})
app.get('/dealer_portal', (req, res) => {
	res.sendFile(__dirname + "/projects/dealer_portal/index.html")
})
app.get('/dealer_portal/home', (req, res) => {
	res.sendFile(__dirname + "/projects/dealer_portal/home.html")
})

const SALT = "potato"
let hash_pw = (pass) => {
	pass = pass + "potato"
	console.log("Hashing pass...: " + pass)
	return sha512(pass)
}

async function insertUser(username, hash, socket) {
	console.log("Attempting to add user to mongo")
	const res = await client.db("LDB").collection("users").insertOne({
		username: username,
		hash: hash,
		session: 0
	})
	console.log(res)
}

async function logUserIn(username, hash, socket) {
	const session_ID = sha512(String(Date.now()))
	const users = client.db("LDB").collection("users")
	let res = await users.find({
		'username': username,
		'hash': hash
	}).toArray()
	if (res.length > 0) {
		console.log(await users.updateOne({ "_id": res[0]['_id'] },
			{ $set: {
				"username": username,
				"hash": hash,
				"session": session_ID
			}}
		))
	}
	socket.emit('login_return', [res, session_ID, username])
}

async function validateLoginCookie(username, session_id, socket) {
	console.log(session_id)
	const users = client.db("LDB").collection("users")
	let res = await users.find({
		'username': username,
		'session': session_id
	}).toArray()
	if (res.length > 0) {
		socket.emit('cookies_validated')
	}
}

io.on('connection', (socket) => {
	socket.on('get_lb_data', async () => {
		getLeaderboardData(socket).catch(console.dir);
	})
	socket.on('login_ping', async (data) => {
		console.log("User hit the Login button!")
		await logUserIn(data[0], hash_pw(data[1]), socket)
	})
	socket.on('create_user', async (data) => {
		console.log("An admin hit the Create User button!")
		await insertUser(data[0], hash_pw(data[1]), socket)
	})
	socket.on('validate_login_cookie', async (data) => {
		console.log("User loaded the login page with an existing cookie. Checking if valid.")
		await validateLoginCookie(data[0], data[1], socket)
	})
	socket.on('join_leaderboard', async (data) => {
		let score = data[0]
		let name = data[1]
		console.log(`new high score. ${score} by ${name}`)
		insertLeaderboardListing(score, name, socket).catch(console.dir);
	})
})

// Local env port to 3000 & live env port to 5000
let port = app.settings['views'].substring(0, 5) === "/User" ? 3000 : 5000
server.listen(port, () =>
	console.log(`Example app listening on port ` + port)
)
