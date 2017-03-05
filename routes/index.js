var express = require('express');
var router = express.Router();
var db = require('monk')('localhost:27017/test');
var userData = db.get('userData');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login/:email', function(req, res, next) {
	var retEmail = req.params.email;
    res.render('loggedin', {email: retEmail});
    console.log('retEmail');
});

router.get('/createAccount', function(req, res, next){
	res.render('createAccount');
});

router.post('/createAccount/submit', function(req, res, next){
	var organizationName = req.body.orgName;
	var organizationEmail = req.body.orgEmail;
	var organizationPassword = req.body.orgPassword;

	var item = {
		name: organizationName,
		email:organizationEmail,
		password:organizationPassword
	};

	userData.insert(item);
	res.render('accSubmit', {name: organizationName});
});

router.post('/login/submit', function(req, res, next){
	var orgEmail = req.body.email;
	var orgPassword = req.body.password;

	var data = userData.findOne({$and:[{"email": orgEmail}, {"password": orgPassword}]});
	data.then(function(data){
		console.log(data);
		if(data == null) {
			res.redirect('/notExist');
		}
    	res.redirect('/login/' + orgEmail);
    });	
});

router.get('/notExist', function(req, res, next){
	res.render('notExist');
});

router.get('/listAccounts', function(req, res, next){
	var list = userData.find({});
	list.then(function(data){
		console.log(data);
		res.render('listAccounts', {listOf: data, helpers: { json: function (context) { 
			return JSON.stringify(context); } }});
	});
});

router.get('/deleteAll', function(req, res, next){
	userData.remove({}).then(function(data){
		res.redirect('/listAccounts');
	});
});
module.exports = router;
