/*
 *  HubSpot Lead Notifications for Slack
 *      - -   SFairchild    - -
 *         CS50e  Spring 2016
 *
 */


//    - - 	REQUIRED MODULES  	- -     //

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var csrf = require('csurf');
var uuid = require('node-uuid');  // GUID generator
var env = require('dotenv').config();  // for reading ENV VARIABLES
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


//		- - 	APP MODULES 	- - 	//

var Database = require('./database/db');
var User = require('./database/models/user');


//    - -    INIT    - -    //

var app = express();
var Database = Database();
Database.init();

//    - -     ENV VARIABLES     - -   //

var SESSION_ID = process.env["SESSION_ID"] = uuid.v4();  // TO-DO update to .v1()
var TABLE = process.env["DB"];
var USR = process.env["DB_USR"];
var KEY = process.env["DB_PASS"];

//    - -     PRIVATE VARIABLES   - -   //

var dbURI = "mongodb://" + USR + ":" + KEY + TABLE;


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

app.use(bodyParser.json());  // parses request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({		// session logger -> store in MongoDB
  name: 'server-session-cookie-id',
  secret: SESSION_ID,
  saveUninitialized: true,
  resave: false,
  store: new MongoStore({
    url: dbURI,
    autoRemove: 'interval',
    autoRemoveInterval: 480
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function printSession(req, res, next) {  // -> logs session updates to console
  console.log('req.session', req.session);
  return next();
});


passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//    - -   ROUTING     - -     //

var root = require('./routes/root');
var login = require('./routes/login');
var register = require('./routes/register');
var logout = require('./routes/logout');

app.use('/', root);
app.use('/login', login);
app.use('/register', register);
app.use('/logout', logout);


//    - -   LISTEN    - -     //

app.listen(app.get('port'), function() {
  console.log('app is running on port', app.get('port'));
});


