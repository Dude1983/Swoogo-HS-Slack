/*
 *  HubSpot Lead Notifications for Slack
 *      - -   SFairchild    - -
 *         CS50e  Spring 2016
 *
 */

require('dotenv').config();  // for reading .ENV VARIABLES

var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var uuid = require('node-uuid');  // GUID generator


//    - -    INIT    - -

var app = express();

/*
 *     - -   .ENV VARIABLES    - -
 *
 *   @param SESSION_ID session ID for verifying user session
 *   @param CLIENT_ID client ID for HubSpot Oauth
 */

var SESSION_ID = process.env["SESSION_ID"] = uuid.v4();  // TO-DO update to .v1()
var CLIENT_ID = process.env["CLIENT_ID"];
var SCOPE = process.env["SCOPE"];


/*
 *	   - -   CONFIG   - - 
 *
 *  set port and static directories
 *  set view engine to ejs - javascript templating engine
 *  
 */

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/*
 *    - -   MIDDLEWARE   - -
 *
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser({secret : SESSION_ID}));
//app.use(session({secret: SESSION_ID}));
//app.use(cookieSession());


/*
 *    - -   HubSpot OAath   - - 
 *      @param Oauth {}
 *      @param redirect_uri
 *      @param client_id
 *      @param scope
 *      @param portalId
 */

var Oauth = {
  redirect_uri: "",
  client_id: CLIENT_ID,
  scope: SCOPE,
  portalId: null
}



//  TO-DO check if user has completed OAuth
//  if not -> send to /login
//  else -> index
//  also need to check for cookies
//  look into CSRF protection

app.get('/', function(req, res){

  console.log("Cookies: ", req.cookies);
  res.render('pages/index', Oauth);

})

app.post('/', function(req, res){

})

app.listen(app.get('port'), function() {
  console.log('app is running on port', app.get('port'));
});



