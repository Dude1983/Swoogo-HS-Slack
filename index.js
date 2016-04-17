/*
 *  HubSpot Lead Notifications for Slack
 *      - -   SFairchild    - -
 *         CS50e  Spring 2016
 *
 */


//    - - REQUIRED MODULES  - -     //

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var csrf = require('csurf');
var uuid = require('node-uuid');  // GUID generator
var env = require('dotenv').config();  // for reading ENV VARIABLES

//    - -    INIT    - -    //

var app = express();

//    - -     ENV VARIABLES     - -   //

var SESSION_ID = process.env["SESSION_ID"] = uuid.v4();  // TO-DO update to .v1()



/*
 *  //	  - -   CONFIG   - -     //
 *
 *  set port and static directories
 *  set view engine to ejs - javascript templating engine
 *  
 */


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



//    - -   MIDDLEWARE   - -    //

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser({secret : SESSION_ID}));

//    - -   ROUTING     - -     //

var root = require('./modules/routes/root');
var login = require('./modules/routes/login');

app.use('/', root);
app.use('/login', login);


var DB = require('./modules/db/db');
var DB = DB();
DB.insert(null);


//    - -   LISTEN    - -     //

app.listen(app.get('port'), function() {
  console.log('app is running on port', app.get('port'));
});


