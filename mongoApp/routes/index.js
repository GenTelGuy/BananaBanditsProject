var express = require('express');
var router = express.Router();
var db = require('monk')('mongodb://cse110:banana@ds137139.mlab.com:37139/cse110');
var userData = db.get('accounts');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/login/:email', function (req, res, next) {
	var retEmail = req.params.email;
	res.render('loggedin', { email: retEmail });
	console.log('retEmail');
});

router.get('/createAccount', function (req, res, next) {
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

	var data = userData.findOne({ $and: [{ "Email": orgEmail }, { "Password": orgPassword }] });
	data.then(function (data) {
		console.log(data);
		if (data == null) {
			res.redirect('/notExist');
		}
		else{
		  res.redirect('/login/' + orgEmail);
		}
	});
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
});

router.get('/deleteAll', function (req, res, next) {
	userData.remove({}).then(function (data) {
		res.redirect('/listAccounts');
	});
});
module.exports = router;
