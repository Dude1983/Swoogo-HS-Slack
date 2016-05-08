var express = require('express');
var ejs = require('ejs');
var passport = require('passport');
var User = require('../database/models/user');
var Database = require('../database/db');


var Database = Database();
var router = express.Router();


// TO-DO: if user is logged in or username is known -> redirect to index or login

router.use(function(req, res, next){
  next();
});

router.get('/', function(req, res){
  if(Database.connection.readyState !== 1){
    Database.init();
  }
  if(req.user){
    res.redirect('/');
  } else {
    res.render('pages/register', {title : "Register | LeadNotify", error : null});
  }
  
});

router.post('/', function(req, res) {
  var status, error;

  if(req.body.password !== req.body.confirm_password){
    res.status(400)
      .render('pages/register', {title : "Register | LeadNotify", error : 'Passwords do no match'});
  } else {
    User.register(new User({username: req.body.username}), req.body.password, function(err, data) {
      if (err) {
        res.status(400)
          .render('pages/register', {title : "Register | LeadNotify", error : err});
      } else {
        passport.authenticate('local')(req, res, function () {
          res.status(200);
          res.redirect('/');
        });
      }
    });
  }
});

module.exports = router;