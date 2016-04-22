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

var Database = require('../database/db')();
var User = require('../database/models/user');
var hsToken = require('../database/models/hsToken');

var router = express.Router();

/*
 *     - -   ENV VARIABLES    - -
 *
 *    @param SESSION_ID String session ID for verifying user session
 *    @param CLIENT_ID  String client ID for HubSpot Oauth
 *    @param SCOPE String scoping for HS API use
 */


var CLIENT_ID = process.env["CLIENT_ID"];
var SCOPE = process.env["SCOPE"];
var REDIRECT_URI = process.env["REDIRECT_URI"]

/*
 *      @param Oauth {} 
 *      @param redirect_uri String
 *      @param client_id String
 *      @param scope String
 *      @param portalId String
 */

var Oauth = {
  redirect_uri: REDIRECT_URI,
  client_id: CLIENT_ID,
  scope: SCOPE,
  portalId: null
}



router.use(function(req, res, next){
	next();
})

router.get('/', function(req, res){
  
  // if Database connection is not open
  if(Database.connection.readyState !== 1){
    Database.init();
  }

  // redirect if not logged in
  
  if(!req.user){
    res.redirect('/login');
  } else {
    
    // if no query params are returned
    if(Object.keys(req.query).length === 0 && JSON.stringify(req.query) === JSON.stringify({})){

      // look for an existing token
      hsToken.where('user_id', req.user.id).then(function(d){
        
        // if a token is returned
        if(d.length){
          
          // HS Oauth was successful 
          res.render('pages/account', {title : "Account | LeadNotify", user : req.user, Oauth : null});
        } else {

          // HS Oauth incomplete
          res.render('pages/account', { title : "Account | LeadNotify", user : req.user , Oauth: Oauth}); 
        }
      })

      // if access token was returned in query params
    } else if (req.query.access_token){
      
      // store access token
      Database.insert(hsToken, {
        user_id : req.user.id,  // SESSION_ID
        hs_access : {
          access_token : req.query.access_token,
          refresh_token : req.query.refresh_token,
          refreshed : new Date()
        }
      });

      res.redirect('/account');
    }
  } 
})

router.post('/', function(req, res){
  if(req.body.hubspotDisconnect){
    hsToken.remove({'user_id' : req.user.id}, function(err){
      if(err) throw err;
    }).then(res.render('pages/account', { title : "Account | LeadNotify", user : req.user , Oauth: Oauth}));
    }
});


module.exports = router;