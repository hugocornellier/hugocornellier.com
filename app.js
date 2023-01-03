const express = require('express');
const path = require('path');
const app = express();
const port = 5000;
app.use(express.static(__dirname));
app.get('/', (req, res) => {        
	res.sendFile(__dirname + "/hugocornellier.html"); 
});
app.get('/projects/orc-rush-tower-defense', (req, res) => {
	res.sendFile(__dirname + "/projects/orc-rush-tower-defense/index.html");
});
app.listen(port, () => 
  console.log(`Example app listening on port ${port}!`)
);
