const express = require('express')
const app = express()
const mongodb = require("mongodb")
const request = require('request');
const requestIp = require('request-ip')
const MongoClient = mongodb.MongoClient
const date = new Date()

// Local env port to 3000 & live env port to 5000
let port = app.settings['views'].substring(0, 5) === "/User" ? 3000 : 5000

app.use(express.static(__dirname))
app.set('trust proxy', 'loopback')
app.get('/', async (req, res) => {
	let ip = requestIp.getClientIp(req)
	let url = "http://api.ipstack.com/" + ip + "?access_key=a2da89892582edff06d9bcba1fefe77e"
	console.log(url)
	let propertiesObject = { field1:'test1', field2:'test2' };
	request({url: url, qs: propertiesObject}, function(err, response, body) {
		if (err) { console.log(err); return; }
		console.log("Get response: " + response.statusCode)
		console.log(body)
		const parsed = JSON.parse(body)
		console.log(parsed)
		insertViewToDb(ip, parsed.city, parsed.region_name, parsed.country_name)
	});

	res.sendFile(__dirname + "/hugocornellier.html")
})
app.get('/projects/*', (req, res) => {
	res.sendFile(__dirname + "/projects/*/index.html")
})
app.listen(port, () =>
	console.log(`Example app listening on port `+port)
)

function insertViewToDb(ip, city, province, country) {
	const connectionURL = "mongodb+srv://root:DoPgkVgBN6goWw3r@cluster0.g6od2xj.mongodb.net/?retryWrites=true&w=majority";
	const dbName = "mydb"
	let db = null
	MongoClient.connect(connectionURL,{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},(err,connectedClient) => {
		if (err) throw err
		db = connectedClient.db(dbName)
		let entry = { ip: ip, city: city, province: province, country: country, date: date }
		console.log("Sending entry: ")
		console.log(entry)
		db.collection("views").insertOne(entry, function(err, res) {
			if (err) throw err
			console.log("1 document inserted")
		})
	})
}

