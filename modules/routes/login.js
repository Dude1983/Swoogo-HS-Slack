var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var csrf = require('csurf');
var uuid = require('node-uuid');  // GUID generator
var env = require('dotenv').config();  // for reading ENV VARIABLES

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


/*
 *      @param Oauth {} Object
 *      @param redirect_uri String
 *      @param client_id String
 *      @param scope String
 *      @param portalId String
 */

var Oauth = {
  redirect_uri: "http://localhost:5000/success",
  client_id: CLIENT_ID,
  scope: SCOPE,
  portalId: null
}

console.log(Oauth);


router.use(function(req, res, next){
	next();
});

router.get('/', function(req, res){

  res.cookie("hs_v", uuid.v4(), {httpOnly: true, secure: true}); // TO-DO figure out how to set cookies per user & link to MongoDb
  res.render('pages/login', {Oauth : Oauth, title : "login"});


});


module.exports = router;