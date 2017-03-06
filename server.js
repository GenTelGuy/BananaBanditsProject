const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID

var path = require('path');
// bodyParser will take html forms and make a formatted object out of them
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use('/images', express.static(__dirname + 'public'));

var db
// connect to the database
MongoClient.connect('mongodb://cse110:banana@ds137139.mlab.com:37139/cse110', (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(3000, () => {
    console.log('listening on 3000');
  });
});
// create the event objects and add them to the database
app.post('/events', (req, res) => {
  var startTime = req.body.StartYear + "-" + req.body.StartMonth + "-" + req.body.StartDay + "T" + req.body.StartHour + ":" + req.body.StartMinute + ":00-08:00Z";
  var endTime = req.body.EndYear + "-" + req.body.EndMonth + "-" + req.body.EndDay + "T" + req.body.EndHour + ":" + req.body.EndMinute + ":00-08:00Z";
  // creates a properly formatted event object from the info the user filled out
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
  // add the event to the database
  db.collection('events').save(event, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/submitEvent.html')
  })
})

// direct user to basic events list
app.get('/submitEvent', (req, res) => {
  res.sendFile(__dirname + '/submitEvent.html')
})

// fetch data on the events in the database
app.get('/data', function (req, res) {
  db.collection('events').find().toArray(function (err, results) {
    console.log(results)
    res.send(results)
  });
});

app.get('/events', (req, res) => {
  res.sendFile(__dirname + '/BasicEventBrowser.html')
});

app.get('/eventDetail', (req, res) => {
  res.sendFile(__dirname + '/EventDetail.html')
});

// search for the event specified by the objectID
app.get('/eventDetailQuery', function (req, res) {
  console.log(req.query);
  // create a string with the objectID to search for
  var newObjectId = new ObjectID.createFromHexString(req.query['$oid']);
  // search using the objectID
  db.collection('events').find(newObjectId).toArray(function (err, results) {
    console.log(results);
    res.send(results);
  });
});

