/*
 *  HubSpot Lead Notifications for Slack
 *      - -   SFairchild    - -
 *         CS50e  Spring 2016
 *
 */


//    - - 	REQUIRED MODULES  	- -     //

var express = require('express');
var helmet = require('helmet');  // some security protection
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

/*
 *  @param Database {} mongoDb connection
 *  @param User {} mongoDb schema for User creds
 */

var Database = require('./database/db')();
var User = require('./database/models/user');


//    - -    INIT    - -    //

var app = express();
Database.init();

//    - -     ENV VARIABLES     - -   //

/*
 *  @param SESSION_ID String
 *  @param dbURI String
 */

var SESSION_ID = process.env["SESSION_ID"] = uuid.v4();  // TO-DO update to .v1()
var dbURI = process.env["dbURI"];


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


// parses request body
app.use(helmet());
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// session logger -> store in MongoDB
app.use(session({		
  name: 'hsSlk_ln',
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

//    - -   ERROR HANDLING    - -     //

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//    - -   SESSION -> CONSOLE    - -     //
/*
app.use(function printSession(req, res, next) {
  console.log('req.session', req.session);
  return next();
});
*/
//    - -     HTTP HEADERS    - -   //

app.disable('x-powered-by');  // hide Express to mitigate targeted attacks

//   - -    INITIALIZE PASSPORT   - -   //

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//    - -   ROUTING     - -     //

var root = require('./routes/root');
var login = require('./routes/login');
var register = require('./routes/register');
var logout = require('./routes/logout');
var account = require('./routes/account');

app.use('/', root);
app.use('/login', login);
app.use('/register', register);
app.use('/logout', logout);
app.use('/account', account);


//    - -   LISTEN    - -     //

app.listen(app.get('port'), function() {
  console.log('app is running on port', app.get('port'));
});


