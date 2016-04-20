var request = require('request');
var querystring = require('querystring');
var mongoose =  require('mongoose');
var hsToken = require('../database/models/hsToken');

module.exports = get_token;

function get_token (id) {

  hsToken.where("user_id", id).then(function(d){
  var dateNow = new Date();
  var refreshedTime = new Date(d[0].hs_access.refreshed);
  var token =  d[0].hs_access.access_token;
  var refreshToken = d[0].hs_access.refresh_token;

  console.log(HS);
  //if((dateNow - refreshedTime) / 1000 >= 28800){
    refresh(refreshToken);
  //} else {
    console.log();
 // }

  });  
}

function refresh(refreshToken){
  
  var options = {
      method : 'POST',
      uri : 'https://api.hubapi.com/auth/v1/refresh',
      body : querystring.stringify({
        "refresh_token" : refreshToken,
        "client_id" : process.env["CLIENT_ID"],
        "grant_type" : refresh_token
      })
    };

    console.log(options.body);

    request(options, function(err, res, body){
      if(err) throw err;
      console.log(res, body);
    });
}