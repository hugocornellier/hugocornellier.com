const express = require('express')
const app = express()
const mongodb = require("mongodb")
const request = require('request')
const moment = require('moment')
const requestIp = require('request-ip')
const MongoClient = mongodb.MongoClient
const connectionURL = "mongodb+srv://root:DoPgkVgBN6goWw3r@cluster0.g6od2xj.mongodb.net/?retryWrites=true&w=majority"
const dbName = "mydb"

app.use(express.static(__dirname))
app.set('trust proxy', 'loopback')
app.get('/', async (req, res) => {
	insertViewToDb(requestIp.getClientIp(req))
	res.sendFile(__dirname + "/hugocornellier.html")
})
app.get('/projects/*', (req, res) => {
	res.sendFile(__dirname + "/projects/*/index.html")
})

// Local env port to 3000 & live env port to 5000
let port = app.settings['views'].substring(0, 5) === "/User" ? 3000 : 5000
app.listen(port, () =>
	console.log(`Example app listening on port ` + port)
)

function insertViewToDb(ip) {
	MongoClient.connect(connectionURL,{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},(err, connectedClient) => {
		if (err) throw err
		let db = connectedClient.db(dbName)
		let collection = "views"

		// Insert view only if IP hasn't already been seen within the last 30 minutes
		db.collection(collection).find({
			ip: ip,
			date: { "$gte" : moment().subtract(30, 'minute').toDate() }
		}).toArray(function(err, result) {
			if (err) throw err
			if (result.length === 0) {
				let url = "http://api.ipstack.com/" + ip + "?access_key=a2da89892582edff06d9bcba1fefe77e"
				let parsed = null
				request({url: url}, function(err, response, body) {
					if (err) { console.log(err); return; }
					parsed = JSON.parse(body)
				})
				let entry = {
					ip: ip,
					city: parsed.city,
					province: parsed.region_name,
					country: parsed.country_name,
					date: new Date()
				}
				db.collection(collection).insertOne(entry, function(err, res) {
					if (err) throw err
					console.log("1 document inserted")
				})
			} else console.log("Not inserting view. This IP was seen within the last 30 minutes.")
		})
	})
}

