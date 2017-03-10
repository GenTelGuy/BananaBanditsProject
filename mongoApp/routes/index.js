var express = require('express');
var router = express.Router();
var db = require('monk')('mongodb://cse110:banana@ds137139.mlab.com:37139/cse110');
const monk = require('monk');
var userData = db.get('accounts');
var eventData = db.get('events');
var userFound = false;
//var session = require('express-session');
//var userSessionName;
//var userSessionPassword;

/**var auth = function(req, res, next) {
	if(req.session && userFound)
		return next();
	else
		return res.sendStatus(401);
};*/
/* GET home page. */
router.get('/', function (req, res, next) {
	console.log(req.session);
	res.render('index', { title: 'Express' });
})

router.get('/login/:email', function (req, res, next) {
	var retEmail = req.params.email;
	res.render('loggedin', { email: retEmail });
	console.log('retEmail');
});

router.get('/createAccount', function (req, res, next) {
	console.log(req.session);
	res.render('createAccount');
});

router.post('/createAccount/submit', function (req, res, next) {
	var account = {
		Org: req.body.orgName,
		Email: req.body.orgEmail,
		Password: req.body.orgPassword,
		OrgBio: "",
		Verified: false,
		Admin: false
	};

	userData.insert(account);
	res.render('accSubmit', { name: req.body.orgName });
});

router.post('/login/submit', function (req, res, next) {
	var orgEmail = req.body.email;
	var orgPassword = req.body.password;

	userData.findOne({ $and: [{ "Email": orgEmail }, { "Password": orgPassword }] }, function(err, user) {
		if(!user) {
			res.redirect('/notExist');
		}
		else {
			req.session.user = user;
			res.redirect('/login/' + orgEmail);
		}
	});
	//var data = userData.findOne({ $and: [{ "Email": orgEmail }, { "Password": orgPassword }] });
	/**data.then(function (data) {
		console.log(data);
		if (data == null) {
			res.redirect('/notExist');
		}
		else {
			//userSessionName = orgEmail;
			//userSessionPassword = orgPassword;
			userFound = true;
			res.redirect('/login/' + orgEmail);
		}
	});*/
});

router.post('/dashbaord', function(req, res, next){
	console.log(req.session);
	//res.render('listAccounts.hbs');
	if(!req.session.user) {
		res.redirect('/listAccounts');

		//return res.status(401);
	}
	else {
		res.redirect('/createAccount');
		//return res.status(200).send('Welcom to Secret key');
	}
});

router.get('/logout', function(req, res){
	req.session.destroy();
	res.render('index');
});

router.get('/notExist', function (req, res, next) {
	res.render('notExist');
});

router.get('/listAccounts', function (req, res, next) {
	var list = userData.find({});
	list.then(function (data) {
		console.log(data);
		res.render('listAccounts', {
			listOf: data, helpers: {
				json: function (context) {
					return JSON.stringify(context);
				}
			}
		});
	});
	//req.session.reset();
});

function requireLogin (req, res, next) {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
};

router.get('/deleteAll', requireLogin, function (req, res) {
	userData.remove({}).then(function (data) {
		res.redirect('/listAccounts');
	});
});

router.get('/submitEvent', function (req, res, next) {
	console.log(req.session);
	if(!req.session.user){
		res.render('notExist');
	}
	else {
		res.render('submitEvent');
	}
});

router.post('/createEvent', function (req, res, next) {
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
	var test = req.session.Email;
	console.log(req.session.user.Email);
	// add the event to the database
	eventData.insert(event);
	console.log('saved event to database');
	res.redirect('/submitEvent')
});

router.get('/eventBrowser', function (req, res, next) {
	res.render('eventBrowser');
});

router.get('/allEventData', function (req, res, next) {
	var eventList = eventData.find({});
	eventList.then(function (data) {
		res.send(data);
	});
});

router.get('/eventDetail', function (req, res, next) {
	res.render('EventDetail')
});

router.get('/eventDetailQuery', function (req, res, next) {
	// search using the objectID
	const id = monk.id(req.query['$oid']);
	var found_id = eventData.find(id);
	found_id.then(function (data) {
		res.send(data);
	});
});

module.exports = router;
