
//    - -   REQUIRED MODULES    - -     //

var request = require('request')
var querystring = require('querystring');
var mongoose =  require('mongoose');


var fs = require('fs');

//    - -   APP MODULES  - -     //
/*
 *  @param Oauth {} mongoDb schema for HS Oauth tokens
 */

var Database = require('../database/db')();
var OauthTokens = require('../database/models/OauthTokens');
var hubspotMetaData = require('../database/models/hubspotMetaData');


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


  OauthTokens.where("user_id", id).then(function(d){

    var dateNow = new Date();
    var refreshedTime = new Date(d[0].hs_access.refreshed);
    var accessToken =  d[0].hs_access.access_token;
    var refreshToken = d[0].hs_access.refresh_token;

    refresh(refreshToken, id, OauthTokens, cb);
  });  

}

function refresh(refreshToken, id, OauthTokens, cb){

  var body =  querystring.stringify({
    refresh_token: refreshToken,
    client_id :process.env["HS_CLIENT_ID"],
    grant_type : "refresh_token"
  });

  // refresh access token
  request({
    method: "POST",
    uri : "https://api.hubapi.com/auth/v1/refresh",
    body : body
    }, 
    function(err, res, d){
      if(err) console.log(err);
      
      var responseBody = JSON.parse(d);

      // execute callback
      cb(responseBody.access_token, id);

      Database.upsert(OauthTokens,
        {
          hs_access : {
            access_token: responseBody.access_token,
            refresh_token: responseBody.refresh_token,
            refreshed : new Date()
          }
        }, 
      id);
    }
  )

}

function getContactProperties(accessToken, id){

  options = {
    method : "GET",
    uri : "https://api.hubapi.com/contacts/v2/properties?access_token=" + accessToken
  }

  request(options, function(err, res, d){
    if(err) console.log(err);
    formatContactProperties(JSON.parse(d), id);
  });

}

function formatContactProperties(d, id){
  var properties = [];
  var property_group = [];
  var upsertObj = {};
  d.forEach(function(d){
    property_group.push(d.groupName);
    if(!d.hidden){
      var prop = {
        name : d.name,
        label : d.label,
        groupName : d.groupName,
        default_selection : false
      };
      properties.push(prop);
    }
  });
  upsertObj.properties = properties;
  upsertObj.property_group = property_group.filter( function( item, index, inputArray ) {
    return inputArray.indexOf(item) == index;
  });;
  upsertContactProperties(upsertObj, id);
}

function upsertContactProperties(d, id){
  Database.upsert(hubspotMetaData, d, id);
}
