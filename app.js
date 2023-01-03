const express = require('express');
const app = express();
app.use(express.static(__dirname));
app.get('/', (req, res) => {
	res.sendFile(__dirname + "/hugocornellier.html"); 
});
app.get('/projects/orc-rush-tower-defense', (req, res) => {
	res.sendFile(__dirname + "/projects/orc-rush-tower-defense/index.html");
});
console.log(app);
if (app.address) {
	app.listen(3000, () =>
		console.log(`Example app listening on port 3000!`)
	);
} else {
	console.log("Not local.");
}
