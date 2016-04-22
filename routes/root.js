//    - -   REQUIRED MODULES    - -     //

var express = require('express');
var ejs = require('ejs');
var passport = require('passport');


//    - -   APP MODULES  - -     //

/*
 *  @param Database {} mongoDb connection
 *  @param User {} mongoDb schema for User creds
 *  @param Oauth {} mongoDb schema for HS Oauth tokens
 */

var Database = require('../database/db');
var User = require('../database/models/user');
var hsToken = require('../database/models/hsToken');



var get_token = require('../classes/hs_utils').get_token;
var refresh = require('../classes/hs_utils').refresh;

var Database = Database();
var router = express.Router();


router.use(function(req, res, next){
	next();
})

router.get('/', function(req, res){
	if(!req.user){
    res.redirect('/login');
  } else {
  	get_token(req.user.id, refresh);
  	res.render('pages/index', {	title : "HubSpot Lead Notifications for Slack | LeadNotify", user : req.user });
  }
})


module.exports = router;