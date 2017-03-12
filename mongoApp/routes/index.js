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
router.get('/login', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/calendar', function (req, res, next) {
	res.render('calendar', { title: 'Express' });
})

router.get('/', function (req, res, next) {
	res.render('homePage', { title: 'Express' });
});

router.get('/login/:email', function (req, res, next) {
	var retEmail = req.params.email;
	res.render('loggedin', { email: retEmail });
	console.log('retEmail');
});

router.get('/createAccount', function (req, res, next) {
	console.log(req.session);
	if(!req.session){
		res.render('notAdmin');
	}
	//else {
	//	if(!req.session.user.Admin) {
	//		res.render('notAdmin');
	//	}
		else {
			res.render('createAccount');
		}
	//}

});

router.post('/createAccount/submit', function (req, res, next) {
	var admin = req.body.admin;
	var json;
	if(admin === "true") {
		json = true;
	}
	else {
		json = false;
	}
	var account = {
		Org: req.body.orgName,
		Email: req.body.orgEmail,
		Password: req.body.orgPassword,
		OrgBio: "",
		Verified: false,
		Admin: json
	};

	userData.insert(account);
	res.render('accSubmit', { name: req.body.orgName });
});

router.post('/login/submit', function (req, res, next) {
	console.log(req.session);
	if(!req.session) { 
		console.log("wtf");
		req.session.destroy(); 
	}
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

router.get('/dashboard', function(req, res, next){
	console.log(req.session);
	//res.render('listAccounts.hbs');
	if(!req.session.user.Admin) {
		res.redirect('/listAccounts');

		//return res.status(401);
	}
	else {
		res.redirect('/createAccount');
		//return res.status(200).send('Welcom to Secret key');
	}
});

router.get('/forgetPassword', function(req, res) {
	res.render('forgetPassword');
});

router.post('/forgetPassword/submit', function(req, res){
	var email = req.body.email;
	var password = req.body.password;
	var confirmPass = req.body.confirmPassword;

	if(password != confirmPass) {
		res.render('notExist', {message: "passwords do not match"});
	}
	userData.update({"Email": email}, {$set: {"Password": password}}, function(err, user){
		console.log(user);
		if(!user){
			res.redirect('/notExist');
		}

		res.redirect('/');
	});
});
router.get('/logout', function(req, res){
	req.session.destroy();
	res.render('homePage');
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

router.get('/verifyAccounts', function(req, res){
	if(req.session.user.Admin == false) {
		res.render('notAdmin');
	}
	else {
		userData.find({"Verified": false}, function(err, user){
			//console.log(user);
			res.render('listUnverified', {listOf: user});
		});
	}
});

router.post('/verify', function(req, res) {
	
		var name = req.body.orgName;
		console.log(name);
		userData.update({"Org": name}, {$set: {"Verified": true}}, function(err, user) {
			console.log(user);
			res.redirect('/verifyAccounts');
		});

		//res.redirect('/');
});

function requireLogin (req, res, next) {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
};

router.get('/deleteAll', function (req, res) {
	userData.remove({}).then(function (data) {
		res.redirect('/listAccounts');
	});
});

router.post('/deleteEvent', function(req, res){
	var name = req.body.eventname;
	console.log(name);
	console.log('9999999');
	eventData.remove({"Title": name}, function(err, user) {
		//console.log(user);
		res.redirect('/eventBrowser');
	});
});

router.get('/checkAdmin', function(req, res, next){
	if(!req.session.user.Admin) {
		console.log("not admin");
		res.send('not admin');
	}
	else { 
		console.log("admin");
		res.send('admin');
	}
});

router.post('/pinEvent', function(req, res) {
	var eventname = req.body.eventpin;
	eventData.update({"Title": eventname}, {$set: {"Featured": true}}, function (err, user){
		res.redirect('/eventBrowser');
	});
});

router.post('/edit', function(req, res){
	console.log("We're chillin at edit. Post worked.")
	var id = req.body.editevent;
	/**var timeStart;
	var timeEnd;
	var description;
	var id;*/

	/**eventData.findOne({"Title": title}, function(err, user) {
		console.log(user);
		timeStart = user.StartTime;
		timeEnd = user.EndTime;
		description = user.Details;
		id = user._id;*/

		res.redirect('/editEvent/' + id);
		//res.redirect('/editEvent/' + title + '/' + timeStart + '/' + timeEnd + '/' + description + '/' + id);
	//});
});

router.get('/editEvent/:id', function(req, res) {
	console.log("We are at edit event. The get function is working");
	var identification = req.params.id;
	eventData.findOne({"_id": identification}, function(err, evt) {
		res.render('editEvent', {name: evt.Title, start: evt.StartTime, end: evt.EndTime, description: evt.Details, id: identification});
	})
})
/**router.get('/editEvent/:title/:timeStart/:endTime/:details/:id', function(req, res) {
	console.log("We are at edit event. The get function is working");
	res.render('editEvent', { name: req.params.title, start: req.params.timeStart, end: req.params.endTime, description: req.params.details, id: req.params.id});
});*/

router.post('/updateEvent', function(req, res) {
	var id = req.body.eventID;
	var oldTitle = req.body.originalTitle;
	var title = req.body.title;
	var details = req.body.Description;
	var startTime = req.body.StartYear + "-" + req.body.StartMonth + "-" + req.body.StartDay + "T" + req.body.StartHour + ":" + req.body.StartMinute + ":00-08:00Z";
	var endTime = req.body.EndYear + "-" + req.body.EndMonth + "-" + req.body.EndDay + "T" + req.body.EndHour + ":" + req.body.EndMinute + ":00-08:00Z";
	eventData.update({"Title": oldTitle}, {$set: {"Title": title, "Details": details, "StartTime": startTime, "EndTime": endTime}}, function(err, user) {
		res.redirect('http://localhost:3000/eventDetail?query=' + id);
	});
});

// should require login
router.get('/submitEvent', function (req, res, next) {
	console.log(req.session);
	if(req.session.user){
        res.render('submitEvent');
    }
    else{
        res.render('requireLogin');
    }
});

router.post('/createEvent', function (req, res, next) {
	console.log(req.body);
	var startTime = req.body.StartYear + "-" + req.body.StartMonth + "-" + req.body.StartDay + "T" + req.body.StartHour + ":" + req.body.StartMinute + ":00-08:00";
	var endTime = req.body.EndYear + "-" + req.body.EndMonth + "-" + req.body.EndDay + "T" + req.body.EndHour + ":" + req.body.EndMinute + ":00-08:00";
	console.log(startTime);
	console.log(endTime);
	// creates a properly formatted event object from the info the user filled out
	const OrgId = monk.id(req.session.user._id);
	var event = {
		Title: req.body.Title,
		Org: OrgId,
		Pictures: [""],
		Details: req.body.Description,
		StartTime: new Date(startTime),
		EndTime: new Date(endTime),
		Location: req.body.Location,
		Tags: [""],
		Email: req.body.Email,
		Phone: req.body.Phone,
		SubmitTime: new Date(),
		Reports: 0,
		Approved: false,
		Expired: false,
		Featured: false
	}
	var test = req.session.Email;
	console.log(req.session.user.Email);
	// add the event to the database
	console.log(req.session.user)
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
	res.render('EventDetail_front')
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
