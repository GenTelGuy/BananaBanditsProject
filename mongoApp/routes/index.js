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
	res.render('login', { title: 'Express' });
});

router.get('/calendar', function (req, res, next) {
	res.render('calendar', { title: 'Express' });
})

router.get('/', function (req, res, next) {
	res.render('homePage', { title: 'Express' });
});

router.get('/login/:email', function (req, res, next) {
	var retEmail = req.params.email;
	res.render('homePage');
	//res.render('loggedin', { email: retEmail });
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
		//res.render('createAccount');
        //res.render('createAccountNew');
        res.render('registerNewAccount');
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
	//if(req.body.orgPassword!=req.body.verifyPassword){
	//	res.send("<h1> Passwords do not match</h1>");
	//}
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
router.post('/login/submit',function(req,res,next){
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
			res.redirect('/');
			//res.redirect('/login/' + orgEmail);
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

router.post('/acceptEvent', function(req, res) {
	
		var name = req.body.Accept;
		eventData.update({"Title": name}, {$set: {"Approved": true}}, function(err, user) {
			res.redirect('/account');
		});

		//res.redirect('/');
});

router.post('/verify', function(req, res) {
	
		var name = req.body.verify;
		console.log(name);
		userData.update({"Org": name}, {$set: {"Verified": true}}, function(err, user) {
			console.log(user);
			res.redirect('/account');
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

router.post('/deleteAccount', function(req, res){
	var name = req.body.accountname;
	console.log(name);
	/*var searchID;
	userData.find({"Org":name},function(err,user){
	    searchID=user._id.str;
	    eventData.remove({"Org": searchID});*/
	userData.remove({"Org": name}, function(err, user) {
		res.redirect('/account');
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

router.get('/accountId',function(req,res,next){
	if(!req.session.user){
		res.send('requireLogin');
	}
	console.log(req.session.user._id);
	res.send(req.session.user._id);
});

router.get('/getSignedIn',function(req,res,next){
	if(req.session.user){
		res.send("USER");
	}
	else{
		res.send("NOT");
	}
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

router.get('/fetchOrgName', function(req,res,next){
	if(!req.session.user){ 
		res.send('requireLogin');
	}
	res.send(req.session.user.Org);
});

router.post('/pinEvent', function(req, res) {
	var eventname = req.body.eventpin;
	eventData.update({"Title": eventname}, {$set: {"Featured": true}}, function (err, user){
		res.redirect('/');
	});
});

router.post('/report', function(req, res) {
	var reportname = req.body.reportEvent;
	eventData.update({"Title": reportname}, {$set: {"Reports": 1}}, function (err, user){
		res.redirect('/eventBrowser');
	});
});

router.post('/clearReport', function(req, res) {
	var reportname = req.body.clearReport;
	eventData.update({"Title": reportname}, {$set: {"Reports": 0}}, function (err, user){
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
		res.render('editEvent_new', {name: evt.Title, start: evt.StartTime, end: evt.EndTime, description: evt.Details, id: identification});
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
	var startTime = req.body.StartYear + "-" + req.body.StartMonth + "-" + req.body.StartDay + "T" + req.body.StartHour + ":" + req.body.StartMinute + ":00-08:00";
	var endTime = req.body.EndYear + "-" + req.body.EndMonth + "-" + req.body.EndDay + "T" + req.body.EndHour + ":" + req.body.EndMinute + ":00-08:00";
    //console.log(startTime);
    //console.log(endTime);
    //console.log(new Date(startTime) + " " + new Date(endTime) );
	eventData.update({"Title": oldTitle}, {$set: {"Title": title, "Details": details, "StartTime": new Date(startTime), "EndTime": new Date(endTime), "SubmitTime": new Date(), "Email": req.body.Email, "Phone": req.body.Phone}}, function(err, user) {
		res.redirect('/eventDetail?query=' + id);
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
		OrgName: req.session.user.Org,
		Pictures: [""],
		Details: req.body.Description,
		StartTime: new Date(startTime),
		EndTime: new Date(endTime),
		Location: req.body.Location,
		Email: req.body.Email,
		Phone: req.body.Phone,
		SubmitTime: new Date(),
		Reports: 0,
		Approved: req.session.user.Verified,
		Expired: false,
		Featured: false
	}
	var test = req.session.Email;
	// add the event to the database
	eventData.insert(event);
	res.redirect('/account')
});

router.get('/eventBrowser', function (req, res, next) {
	//res.render('eventBrowser');
    eventData.find({}, function(err, evts){
			//console.log(user);
        
			res.render('eventSearch', {allEvents: evts});
		});
    //res.render('eventSearch');
});

router.get('/allEventData', function (req, res, next) {
	var eventList = eventData.find({});
	eventList.then(function (data) {
		res.send(data);
	});
});

router.get('/allAccountData', function (req, res, next) {
	userData.find({"Verified": false}, function(err, user){
			//console.log(user);
			res.send(/*listOf:*/ user);
		});
/*var accountList = userData.find({"Verified":false});
	accountList.then(function (data) {
		res.send(data);
	});*/
});

router.get('/accountDetail', function (req, res, next) {
	res.render('AccountDetails')
});
router.get('/eventDetail', function (req, res, next) {
	res.render('EventDetail_front')
});

router.get('/accountDetailQuery', function (req, res, next) {
	// search using the objectID
	const id = monk.id(req.query['$oid']);
	var found_id = userData.find(id);
	found_id.then(function (data) {
		res.send(data);
	});
});
router.get('/eventDetailQuery', function (req, res, next) {
	// search using the objectID
	const id = monk.id(req.query['$oid']);
	var found_id = eventData.find(id);
	found_id.then(function (data) {
		res.send(data);
	});
});

router.get('/acceptRejectEvents', function (req, res, next) {
	res.render('acceptRejectEvents')
});

router.get('/orgDetail', function (req, res, next) {
	res.render('orgDetail')
});

router.get('/forgotPassword', function (req, res, next) {
	res.render('forgotPassword')
});

router.get('/pastEvents', function (req, res, next) {
	res.render('pastEvents')
});

router.get('/forgotPassword', function (req, res, next) {
	res.render('forgotPassword')
});

router.get('/reportedEvents', function (req, res, next) {
	res.render('reportedEvents')
});

router.get('/updatePassword', function (req, res, next) {
	res.render('updatePassword')
});

router.get('/account',function (req,res,next){
	if(req.session.user){
		if(req.session.user.Admin){
			res.render('AdminOrgDetail');
		}
		else{
        		res.render('OrgDetail');
		}
    }
    else{
        res.render('requireLogin');
    }

});

module.exports = router;
