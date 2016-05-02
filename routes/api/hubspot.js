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
var hubspotMetaData = require('../../database/models/hubspotMetaData');


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
  
    res.end();
  }
});

router.get('/properties', function(req, res){
  if(!req.user){
    res.redirect('/login');
  } else {
    hubspotMetaData.where({'user_id' : req.user.id}).then(function(d){
      res.status(200).send(
        {
          properties : d[0].properties,
          selected_properties : d[0].selected_properties
        });
      res.end();
    });
  }
});

/*
 *    - -   POST REQUESTS     - -     *//*
 */

router.post('/', function(req, res){
  res.status(200);

  var authHeader = new Buffer(req.headers.authorization.toString().split(' ')[1], 'base64').toString('ascii');

  var properties = req.body.properties;
  

  slackUtils.postMessage({user_id : req.user.id, auth : authHeader, properties : properties});
  res.end();
});


module.exports = router;