const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const request = require('request-promise')
const cors = require('cors');
app.use(cors({
	origin: ['https://www.thecabindepot.com', 'https://www.thecabindepot.ca']
}));
const server = http.createServer(app)
const io = new Server(server)
const { MongoClient } = require("mongodb");
let pw = encodeURIComponent("+z:~hu2z._pC98u")
const uri = `mongodb+srv://hugocornellier:${pw}@giveawayentries.165wcgp.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri)

app.use(express.static(__dirname))
app.get('/', async (req, res) => {
	res.sendFile(__dirname + "/client/hugocornellier.html")
})
app.get('/dealer_portal', async (req, res) => {
	res.sendFile(__dirname + "/projects/dealer_portal/index.html")
})
app.get('/api', async (req, res) => {
	fetch("https://checkip.amazonaws.com/").then(res => res.text()).then(data => {
		request('http://ip-api.io/api/json/' + data)
		.then(response => {
			response = JSON.parse(response)
			json = {
				c_name: response['country_name'],
				r_code: response['region_code'],
				r_name: response['region_name']
			}
			res.json(json)
		})
		.catch(err => console.log(err))
	})
})
app.get('/projects/*', (req, res) => {
	res.sendFile(__dirname + "/client/projects/*/index.html")
})

async function run(name, email, socket) {
	const database = client.db("insertDB")
	const giveaway_entries = database.collection("giveaway_entries")
	const doc = {
		email: email,
		name: name,
	}
	const result = await giveaway_entries.insertOne(doc)
	socket.emit('entry_added', result)
}

io.on('connection', (socket) => {
	socket.on('giveaway_entry', (data) => {
		console.log('data: ' + data);
		run(data[0], data[1], socket).catch(console.dir);
	})
	socket.on('conn', () => {
		fetch("https://checkip.amazonaws.com/").then(res => res.text()).then(data => {
			request('http://ip-api.io/api/json/' + data)
				.then(response => {
					response = JSON.parse(response)
					console.log(response)
					socket.emit('result', response['country_name'], response['region_code'], response['region_name'])
				})
				.catch(err => console.log(err))
		})
	})
})

// Local env port to 3000 & live env port to 5000
let port = app.settings['views'].substring(0, 5) === "/User" ? 3000 : 5000
server.listen(port, () =>
	console.log(`Example app listening on port ` + port)
)
