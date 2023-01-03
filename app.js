const express = require('express');
const path = require('path');
const req = require("express/lib/request");
const app = express();
const port = 169;
app.use(express.static(__dirname));
app.get('/', (req, res) => {        
	res.sendFile(__dirname + "/hugocornellier.html"); 
});
app.get('/projects/orc-rush-tower-defense', (req, res) => {
	res.sendFile(__dirname + "/projects/orc-rush-tower-defense/index.html");
});
if (req.headers['x-forwarded-for'] == null) {
	app.listen(3000, () =>
		console.log(`Example app listening on port 3000!`)
	);
} else {
	app.listen(5000, () =>
		console.log(`Example app listening on port 5000!`)
	);
}