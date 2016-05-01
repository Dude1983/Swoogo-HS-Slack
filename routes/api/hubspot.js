/*
 *    - -       API FOR SLACK  - -     *//*
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

var Database = require('../../database/db');
var User = require('../../database/models/user');
var OauthTokens = require('../../database/models/OauthTokens');


//    - -   REQUIRED METHODS  - -     //

var hsUtils = require('../../classes/hs_utils');
var slackUtils = require('../../classes/slack_utils');



var Database = Database();
var router = express.Router();


router.use(function(req, res, next){
	next();
})

/*
 *    - -   GET REQUESTS     - -     *//*
 */
router.get('/', function(req, res){
	

  // TO-DO check cookie in req.headers to confirm auth
  if(!req.user){
    res.redirect('/login');
  } else {
  
    // if first login insert new Oauth row
  	//Database.newOauthRow(req.user.id);

    res.status(200).send('OK');
      
      
  
  }
})

/*
 *    - -   POST REQUESTS     - -     *//*
 */

router.post('/', function(req, res){
  res.status(200);
  console.log(req.headers);
  res.end();
});


module.exports = router;