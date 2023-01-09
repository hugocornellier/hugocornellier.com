const express = require('express')
const app = express()
const requestIp = require('request-ip')
const logger = require('./js/logger.js');

app.use(express.static(__dirname))
app.set('trust proxy', 'loopback')
app.get('/', async (req, res) => {
	logger.insertViewToDb(requestIp.getClientIp(req))
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

