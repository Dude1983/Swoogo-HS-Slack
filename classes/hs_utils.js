
//    - -   REQUIRED MODULES    - -     //

var request = require('request')
var querystring = require('querystring');
var mongoose =  require('mongoose');


var fs = require('fs');

//    - -   APP MODULES  - -     //
/*
 *  @param Oauth {} mongoDb schema for HS Oauth tokens
 */

var hsToken = require('../database/models/hsToken');


//    - -   EXPORTS     - -     //

module.exports.get_token = get_token;
module.exports.refresh = refresh;
module.exports.getContactProperties = getContactProperties;

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

    // if accessToken expired (converts time to seconds)
    //if((dateNow - refreshedTime) / 1000 >= TTL){

      refresh(refreshToken, id, hsToken, cb);
      return;

    //} else {
      
      //cb(accessToken);
      //return;

    //}

  });  

}

function refresh(refreshToken, id, hsToken, cb){
  
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
    
    
    var responseBody = JSON.parse(d);

    // execute callback
    cb(responseBody.access_token);



      // update hsToken document in MongoDb
      hsToken.update({ "user_id" : id }, 
        { $set : {
          hs_access : {
            access_token: responseBody.access_token,
            refresh_token: responseBody.refresh_token,
            refreshed : new Date()
          }
        }
      });

      
  })

}

function getContactProperties(accessToken){
  
  options = {
    method : "GET",
    uri : "https://api.hubapi.com/contacts/v2/properties?access_token=" + accessToken
  }

  request(options, function(err, res, d){
    if(err) console.log(err);
    
    var responseBody = JSON.parse(d);

    //fs.writeFile('../hs_contact_properties.json', d, 'utf8');

    //console.log(responseBody);
    responseBody.forEach(function(d){

    })

  })

}