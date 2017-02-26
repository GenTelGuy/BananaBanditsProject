const express = require('express');
const session = require('express-session');    //added
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID

var path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use('/images', express.static(__dirname + 'public'));
app.use(session({secret: 'ssshhhhh', saveUninitialized: true, resave: true}));        //added

var db
var sess;

MongoClient.connect('mongodb://cse110:banana@ds137139.mlab.com:37139/cse110', (err, database) => {
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
});

app.get('/eventDetail', (req, res) => {
  res.sendFile(__dirname + '/EventDetail.html')
});

app.get('/eventDetailQuery', function (req, res) {
  //const body = req.body.Body
  console.log(req.query);
  var newObjectId = new ObjectID.createFromHexString(req.query['$oid']);
  //res.set('Content-Type', 'text/plain')
  db.collection('events').find(newObjectId).toArray(function (err, results) {
  console.log(results);
  res.send(results);
});
});

/* when login is requested load login form */
app.get('/login',function(req,res){
  res.sendFile(__dirname+'/login.html');

});

/* when requested write the session info */
app.post('/loginInfo',function(req,res){
	sess=req.session;
	sess.email=req.body.email;
	res.end('done');    //send out done so files know its done writing.
});

/* temp page used to show successful login */
app.get('/admitted',function(req,res){
	/* store login info, if theres an email then
	   print hello user.email and provide myAccount
	   and login buttons 
	*/
	sess=req.session;
	if(sess.email){
		res.write('<h1>Hello '+sess.email+'</h1><br>');
		res.write('<a href='+'/account'+'>My Account</a></br>');
		res.end('<a href='+'/events'+'>Logout</a>');
	}
	/* if no email redirect to /login */
	else{
		res.write('<h1>Please login first.</h1>');
		res.end('<a href='+'/login'+'>Login</a>');
	}
});

/* basic account page */
app.get('/account',function(req,res){
	/* get session info, if not logged in
	   direct to log in, otherwise send to 
	   account page
	*/
	sess=req.session;
	if(sess.email){
		res.sendFile(__dirname+'/account.html');
	}
	else{
		res.write('<h1>Please login first.</h1>');
		res.end('<a href='+'/login'+'>Login</a>');
	}

});

/* basic create account form */
app.get('/createAccount',function(req,res){
	res.sendFile(__dirname+'/createAccount.html');
});

/* basic admin page, without database info looks like account page */
app.get('/adminAccount',function(req,res){
	sess=req.session;
	if(sess.email){
		res.sendFile(__dirname+'/adminAccount.html');
	}
	else{
		res.write('<h1>Please login first. </h1>');
		res.end('<a href='+'/login'+'>Login</a>');
	}
});
