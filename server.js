const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;

var path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use('/images', express.static(__dirname + 'public'));

var db

MongoClient.connect('mongodb://me:123qwe@ds153609.mlab.com:53609/practice-database', (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(3000, () => {
    console.log('listening on 3000');
  });
});

app.post('/events', (req, res) => {
  var startTime = req.body.StartYear + "-" + req.body.StartMonth + "-" + req.body.StartDay + "T" + req.body.StartHour + ":" + req.body.StartMinute + ":00-08:00";
  var endTime = req.body.EndYear + "-" + req.body.EndMonth + "-" + req.body.EndDay + "T" + req.body.EndHour + ":" + req.body.EndMinute + ":00-08:00";
  console.log(startTime);
  console.log(endTime);
  var event = {
    Title: req.body.Title,
    Org: "",
    Pictures: [""],
    Details: req.body.Description,
    StartTime: new Date(startTime),
    EndTime: new Date(endTime),
    Location: "",
    Tags: [""],
    SubmitTime: new Date(),
    Reports: 0,
    Approved: false,
    Expired: false,
    Featured: false
  }
  db.collection('events').save(event, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/data', function (req, res) {
  db.collection('events').find().toArray(function (err, results) {
    console.log(results);
    res.send(results);
  });
});

app.get('/events', (req, res) => {
  res.sendFile(__dirname + '/BasicEventBrowser.html')
})
