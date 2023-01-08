const express = require('express')
const app = express()
const mongodb = require("mongodb")
const axios = require('axios')
const MongoClient = mongodb.MongoClient
const date = new Date()
const IP = require('ip')
const geoip = require('geoip-lite')

// Local env port to 3000 & live env port to 5000
let port = app.settings['views'].substring(0, 5) === "/User" ? 3000 : 5000
let ip = null

const sendAPIRequest = async (ipAddress) => {
	const apiResponse = await axios.get(URL + "&ip_address=" + ipAddress);
	return apiResponse.data;
}

app.use(express.static(__dirname))
app.set('trust proxy',true)
app.get('/', async (req, res) => {
	ip = req.ip
	console.log(ip)
	insertViewToDb()
	console.log(ip)
	let geo = geoip.lookup(ip);
	console.log(geo);
	res.sendFile(__dirname + "/hugocornellier.html")
})
app.get('/projects/orc-rush-tower-defense', (req, res) => {
	res.sendFile(__dirname + "/projects/orc-rush-tower-defense/index.html")
})
app.get('/projects/resto', (req, res) => {
	res.sendFile(__dirname + "/projects/resto/index.html")
})
app.listen(port, () =>
	console.log(`Example app listening on port `+port)
)

function insertViewToDb() {
	const connectionURL = "mongodb+srv://root:DoPgkVgBN6goWw3r@cluster0.g6od2xj.mongodb.net/?retryWrites=true&w=majority";
	const dbName = "mydb"
	let db = null
	MongoClient.connect(connectionURL,{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},(err,connectedClient) => {
		if (err) throw err
		db = connectedClient.db(dbName)
		let entry = { ip: ip, city: "Fredericton", country: "Canada", date: date }
		db.collection("user-views").insertOne(entry, function(err, res) {
			if (err) throw err
			console.log("1 document inserted")
		})
	})
}

