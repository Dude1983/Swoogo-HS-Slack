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
var getContactProperties = require('../classes/hs_utils').getContactProperties;

var Database = Database();
var router = express.Router();


router.use(function(req, res, next){
	next();
});

router.get('/', function(req, res){
	if(!req.user){
    res.redirect('/login');
  } else {
		res.status(405).render('pages/error', {title : "405 | LeadNotify", user : req.user, header : "405 Method Not Allowed", message : "Sorry, but the specified HTTP Method is not allowed." });
	}
});

router.post('/', function(req, res){
  console.log(req.header);

  res.status(200);

});

module.exports = router;