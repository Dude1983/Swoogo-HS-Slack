/*
 *    - -       INDEX PAGE HANDLING  - -     *//*
 *           
 */


//    - -   REQUIRED MODULES    - -     //

var express = require('express');
var ejs = require('ejs');
var passport = require('passport');


//    - -   APP MODULES  - -     //

/*
 *  @param Database {} mongoDb connection
 *  @param User {} mongoDb schema for User creds
 *  @param OauthTokens {} mongoDb schema for Oauth tokens
 */

var Database = require('../database/db');
var User = require('../database/models/user');
var OauthTokens = require('../database/models/OauthTokens');

//    - -   REQUIRED METHODS  - -     //

var get_token = require('../classes/hs_utils').get_token;
var refresh = require('../classes/hs_utils').refresh;
var getContactProperties = require('../classes/hs_utils').getContactProperties;



var Database = Database();
var router = express.Router();


router.use(function(req, res, next){
	next();
})

/*
 *    - -   GET REQUESTS     - -     *//*
 */
router.get('/', function(req, res){
	if(!req.user){
    res.redirect('/login');
  } else {
  	
  	// upsert SLACK Oauth params in DB
    OauthTokens.update({ "user_id" : req.user.id }, 
      { $set : {
          user_id : req.user.id
        }
      }, { upsert : true },
      function(err){
        if(err){
          console.log(err);
        }
      });
  	//get_token(req.user.id, getContactProperties);
  	res.render('pages/index', {	title : "HubSpot Lead Notifications for Slack | LeadNotify", user : req.user });
  
  }
})

/*
 *    - -   POST REQUESTS     - -     *//*
 */

router.post('/', function(req, res){
  res.status(405);  // POST REQUESTS NOT ACCEPTED AT THIS PATH
});


module.exports = router;