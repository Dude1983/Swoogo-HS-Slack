var express = require('express');
var ejs = require('ejs');
var Database = require('../database/db');
var passport = require('passport');
var User = require('../database/models/user');
var hsToken = require('../database/models/hsToken');
var get_token = require('../classes/hs_utils');

var Database = Database();
var router = express.Router();


router.use(function(req, res, next){
	next();
})

router.get('/', function(req, res){
	if(!req.user){
    res.redirect('/login');
  } else {
  	get_token(req.user.id);
  	res.render('pages/index', {	title : "HubSpot Lead Notifications for Slack | LeadNotify", user : req.user });
  }
})


module.exports = router;