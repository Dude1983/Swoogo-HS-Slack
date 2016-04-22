
//    - -   REQUIRED MODULES    - -     //

var request = require('request')
var querystring = require('querystring');
var mongoose =  require('mongoose');

//    - -   APP MODULES  - -     //
/*
 *  @param Oauth {} mongoDb schema for HS Oauth tokens
 */

var hsToken = require('../database/models/hsToken');


//    - -   EXPORTS     - -     //

module.exports.get_token = get_token;
module.exports.refresh = refresh;

//    - -   ENV VARIABLES   - - //
/*
 *  @param TTL String - refresh token TTL
 */

var TTL = process.env["TTL"];



//    - -   METHODS     - -   //


function get_token (id, cb) {

  hsToken.where("user_id", id).then(function(d){
    

    var dateNow = new Date();
    var refreshedTime = new Date(d[0].hs_access.refreshed);
    var accessToken =  d[0].hs_access.access_token;
    var refreshToken = d[0].hs_access.refresh_token;

    // if accessToken expired
    if((dateNow - refreshedTime) / 1000 >= TTL){
      
      refresh(refreshToken);
      get_token(id, cb);
      return;

    } else {
      
      cb(accessToken);
      return;

    }

  });  
}

function refresh(refreshToken){
  
  // POST options 
  var options = {
    method: "POST",
    uri : "https://api.hubapi.com/auth/v1/refresh",
    body: querystring.stringify({
      refresh_token: refreshToken,
      client_id :process.env["CLIENT_ID"],
      grant_type : "refresh_token"
    })
  }

  // refresh access token
  request(options, function(err, res, d){
    if(err) console.log(err);
    console.log(d);
  })
}

function getContactProperties(accessToken){
  
  options = {
    method : "GET",
    uri : "https://api.hubapi.com/contacts/v2/properties?access_token=" + accessToken
  }

  if(refresh){
    refresh(refreshToken);
  } else {

  }
}
