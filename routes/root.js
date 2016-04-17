var express = require('express');
var ejs = require('ejs');
var Database = require('../database/db');
var passport = require('passport');
var User = require('../database/models/user');

var Database = Database();
var router = express.Router();


/*
 *     - -   ENV VARIABLES    - -
 *
 *    @param SESSION_ID session ID for verifying user session
 *    @param CLIENT_ID client ID for HubSpot Oauth
 *    @param SCOPE sets the scoping for HS API use
 */


var CLIENT_ID = process.env["CLIENT_ID"];
var SCOPE = process.env["SCOPE"];
var REDIRECT_URI = process.env["REDIRECT_URI"]

/*
 *      @param Oauth {} Object
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

  console.log(req.user);
  res.render('pages/index', {	title : "LeadNotify", user : req.user });
})


module.exports = router;