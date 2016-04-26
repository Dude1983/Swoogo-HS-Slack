var express = require('express');
var ejs = require('ejs');
var passport = require('passport');
var User = require('../database/models/user');

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
    res.render('pages/register', {title : "Register | LeadNotify"});
  }
  
});

router.post('/', function(req, res) {
  User.register(new User({username: req.body.username}), req.body.password, function(err, data) {
    if (err) {
      res.render('pages/register', { title: "Register | LeadNotify"});
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
});

module.exports = router;