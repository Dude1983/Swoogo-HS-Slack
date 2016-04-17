var express = require('express');
var ejs = require('ejs');
var passport = require('passport');
var User = require('../database/models/user');

var router = express.Router();



router.use(function(req, res, next){
  next();
});

router.get('/', function(req, res){

  console.log(req.session);

  res.render('pages/register', {title : "Register"});

});

router.post('/', function(req, res) {
  console.log(req.body);
  User.register(new User({username: req.body.username}), req.body.password, function(err, data) {
    if (err) {
      console.log(data);
      res.render('pages/register', { title: "Register"});
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
});

module.exports = router;