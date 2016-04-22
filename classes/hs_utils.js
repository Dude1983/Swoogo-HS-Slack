var request = require('request')
var querystring = require('querystring');
var mongoose =  require('mongoose');
var hsToken = require('../database/models/hsToken');

module.exports.get_token = get_token;
module.exports.refresh = refresh;

function get_token (id, refresh) {

  hsToken.where("user_id", id).then(function(d){
  var dateNow = new Date();
  var refreshedTime = new Date(d[0].hs_access.refreshed);
  var token =  d[0].hs_access.access_token;
  var refreshToken = d[0].hs_access.refresh_token;

  
  if((dateNow - refreshedTime) / 1000 >= 28800){
    refresh(refreshToken);
  } else {
    console.log();
  }

  });  
}

function refresh(token){
  var options = {
    method: "POST",
    uri : "https://api.hubapi.com/auth/v1/refresh",
    body: querystring.stringify({
      refresh_token: token,
      client_id :process.env["CLIENT_ID"],
      grant_type : "refresh_token"
    })
  }


  request(options, function(err, res, d){
    if(err) console.log(err);
    else{
      console.log(d);
    }
  })
}

