const express = require('express');
const app = express();
let port = app.settings['views'].substring(0, 5) === "/User" ? 3000 : 5000;
app.use(express.static(__dirname));
app.get('/', (req, res) => {
	res.sendFile(__dirname + "/hugocornellier.html"); 
});
app.get('/projects/orc-rush-tower-defense', (req, res) => {
	res.sendFile(__dirname + "/projects/orc-rush-tower-defense/index.html");
});
app.listen(port, () =>
	console.log(`Example app listening on port `+port)
);
