const express = require('express')
const app = express()
const http = require('http')
const { sha512 } = require('js-sha512');
const { Server } = require('socket.io')
const cors = require('cors');
app.use(cors({
	origin: ['https://www.thecabindepot.com', 'https://www.thecabindepot.ca']
}));
const SALT = "potato"
const server = http.createServer(app)
const io = new Server(server)
const { MongoClient } = require("mongodb");
let pw = encodeURIComponent("+z:~hu2z._pC98u")
const uri = `mongodb+srv://hugocornellier:${pw}@leaderboard.qrubtzl.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri)

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
app.get('/dealer_portal/hometest', (req, res) => {
	res.sendFile(__dirname + "/projects/dealer_portal/home_test.html")
})

async function insertLBListing(score, name, socket) {
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

const hash_pw = (pass) => {
	return sha512(pass + SALT)
}

async function insertUser(username, hash, type, socket) {
	console.log("Creating user...")
	const users = client.db("LDB").collection("users")
	let res1 = null, success = false, message = ""
	let existing_user = await users.find({ 'username': username }).toArray()
	if (existing_user.length === 0) {  // If username doesn't already exist...
		console.log("Here.")
		res1 = await users.insertOne({
			username: username,
			hash: hash,
			session: 0,
			type: type
		})
		success = res1.acknowledged
	} else message = "User already exists."
	socket.emit('create_user_return', [res1, success, message])
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
	const users = client.db("LDB").collection("users")
	let res = await users.find({
		'username': username,
		'session': session_id
	}).toArray()
	if (res.length > 0) socket.emit('cookies_validated', res)
	else socket.emit('cookies_validation_failure')
}

io.on('connection', (socket) => {
	socket.on('login', async (data) => await logUserIn(data[0], hash_pw(data[1]), socket))
	socket.on('create_user', async (data) => await insertUser(data[0], hash_pw(data[1]), data[2], socket))
	socket.on('validate', async (data) => await validateLoginCookie(data[0], data[1], socket))
	socket.on('get_lb_data', async () => getLeaderboardData(socket).catch(console.dir))
	socket.on('join_lb', async (data) => insertLBListing(data[0], data[1], socket).catch(console.dir))
})

// Local env port to 3000 & live env port to 5000
server.listen(app.settings['views'].substring(0, 5) === "/User" ? 3000 : 5000, () => console.log(`App running!`))
