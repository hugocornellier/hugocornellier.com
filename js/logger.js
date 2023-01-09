const {MongoClient} = require("mongodb");
const moment        = require("moment");
const request       = require("request");
const connectionURL = "mongodb+srv://root:DoPgkVgBN6goWw3r@cluster0.g6od2xj.mongodb.net/?retryWrites=true&w=majority"
const dbName        = "mydb"

/* Log user view including IP, city name, country and region
   Insert view only if IP hasn't already been seen within the last 30 minutes */
module.exports = {
    insertViewToDb: function insertViewToDb(ip) {
    MongoClient.connect(connectionURL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    },(err, client) => {
        if (err) { console.log("failure connecting to client"); console.log(err); return; }
        let views = client.db(dbName).collection("views")
        views.find({
            ip: ip,
            date: { "$gte" : moment().subtract(30, 'minute').toDate() }
        }).toArray(function(err, result) {
            if (err) { console.log(err); return; }
            if (result.length > 0) {
                console.log("Not inserting view. This IP was seen within the last 30 minutes.")
                return true
            } else {
                console.log("New IP! Not seen in the last 30 mins: " + ip)
            }
            let url = "http://api.ipstack.com/" + ip + "?access_key=a2da89892582edff06d9bcba1fefe77e"
            request({url: url}, function(err, response, body) {
                if (err) { console.log(err); return; }
                let data = JSON.parse(body)
                views.insertOne({
                    ip: ip,
                    city: data.city,
                    province: data.region_name,
                    country: data.country_name,
                    date: new Date()
                }, function(err) {
                    if (err) throw err
                    console.log("1 document inserted")
                })
            })
        })
    })
}
}