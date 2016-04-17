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
  res.render('pages/login', {title : "login", user : req.user});
});

router.post('/', passport.authenticate('local'), function(req, res) {
	console.log(req.session);
  res.redirect('/');
});

module.exports = router;