var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
//var request = require('request');

var client_id = "973a83bb-03e4-11e6-9653-93a39db85acf";
var portalId = 471491;


var getUrl = "https://app.hubspot.com/auth/authenticate?client_id=973a83bb-03e4-11e6-9653-93a39db85acf&portalId="+portalId+"&redirect_uri=http://localhost:5000&scope=offline";

var app = express();

// set port
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
// views is directory for all template files
app.set('views', __dirname + '/views');
// set templating engine as ejs
app.set('view engine', 'ejs');


// use body parser middleware for parsing http request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 
app.get('/', function(req, res){
  res.render('pages/index');
})

app.post('/', function(req, res){
  // verify authorization
  /*if(req.body.token !== token){
    res.sendStatus(401);
    exit(1);
  } */
 
 console.log(req.body);
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



