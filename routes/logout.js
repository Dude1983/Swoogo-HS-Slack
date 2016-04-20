var express = require('express');
var ejs = require('ejs');
var passport = require('passport');
var User = require('../database/models/user');

var router = express.Router();

router.use(function(req, res, next){
	next();
});

router.get('/', function(req, res){
  req.logout();
	res.render('pages/logout', {	title : "Logout | LeadNotify" });
});

module.exports = router;