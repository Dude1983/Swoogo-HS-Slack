var express = require('express');
var ejs = require('ejs');
var DB = require('../db/db');
var DB = DB();

var router = express.Router();

/*
 *     - -   ENV VARIABLES    - -
 *
 *    @param SESSION_ID session ID for verifying user session
 *    @param CLIENT_ID client ID for HubSpot Oauth
 *    @param SCOPE sets the scoping for HS API use
 */

var SESSION_ID = process.env["SESSION_ID"];
var CLIENT_ID = process.env["CLIENT_ID"];
var SCOPE = process.env["SCOPE"];



var CLIENT_ID = process.env["CLIENT_ID"];
var SCOPE = process.env["SCOPE"];


//  TO-DO check if user has completed OAuth
//  if not -> send to /login
//  else -> index
//  also need to check for cookies
//  look into CSRF protection

router.use(function(req, res, next){
	next();
})

router.get('/', function(req, res){
  console.log(req.cookies);
  res.render('pages/index', {title : "LeadNotify"});
})


module.exports = router;