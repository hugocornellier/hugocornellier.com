const express = require('express');
const app = express();
const date = new Date();
// Local env port to 3000 & live env port to 5000
let port = app.settings['views'].substring(0, 5) === "/User" ? 3000 : 5000;
app.use(express.static(__dirname));
app.get('/', (req, res) => {
	let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
	console.log(ip)
	res.sendFile(__dirname + "/hugocornellier.html")
});
app.get('/projects/orc-rush-tower-defense', (req, res) => {
	res.sendFile(__dirname + "/projects/orc-rush-tower-defense/index.html");
});
app.get('/projects/resto', (req, res) => {
	res.sendFile(__dirname + "/projects/resto/index.html");
});
app.listen(port, () =>
	console.log(`Example app listening on port `+port)
);

const mongodb = require("mongodb");
const connectionURL = "mongodb+srv://root:DoPgkVgBN6goWw3r@cluster0.g6od2xj.mongodb.net/?retryWrites=true&w=majority";
const dbName = "mydb"
const MongoClient = mongodb.MongoClient;
let db = null;

MongoClient.connect(connectionURL,{
	useNewUrlParser: true,
	useUnifiedTopology: true
},(err,connectedClient) => {
	if(err) throw err;
	db = connectedClient.db(dbName);
	let entry = { ip: "100.100.100.1", city: "Fredericton", country: "Canada", date: date };
	db.collection("user-views").insertOne(entry, function(err, res) {
		if (err) throw err;
		console.log("1 document inserted");
	});

})
