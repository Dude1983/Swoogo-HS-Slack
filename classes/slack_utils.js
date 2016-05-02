
//    - -   REQUIRED MODULES    - -     //

var request = require('request')
var querystring = require('querystring');
var mongoose =  require('mongoose');
var env = require('dotenv').config(); 


var fs = require('fs');

//    - -   APP MODULES  - -     //
/*
 *  @param Oauth {} mongoDb schema for HS Oauth tokens
 */

var Database = require('../database/db.js');
var OauthTokens = require('../database/models/OauthTokens');
var messageMetaData = require('../database/models/messageMetaData');
var slackMetaData = require('../database/models/slackMetaData');


//    - -   EXPORTS     - -     //

module.exports.Oauth = Oauth;
module.exports.getToken = getToken;
module.exports.insertToken = insertToken;
module.exports.listChannels = listChannels;
module.exports.postMessage = postMessage;
module.exports.getMessageMeta = getMessageMeta;


//    - -   ENV VARIABLES   - -     //

/*
 * @param client_id String - Slack client ID
 * @param client_secret String - Slack client secret
 * @param redirect_uri String - Oauth redirect
 */

var slack_client_id = process.env["SLACK_CLIENT_ID"];
var slack_client_secret = process.env["SLACK_CLIENT_SECRET"];
var slack_redirect_uri = process.env["SLACK_REDIRECT_URI"];



//    - -     METHODS       - -   //


function Oauth (row, req, insertToken){


// TO-DO: ensure auth

 /*if(req.state !== row.slack_access.state){
    return false;
  } else {
*/
    var params = querystring.stringify({
      client_id : slack_client_id,
      client_secret : slack_client_secret,
      code : req.code,
      redirect_uri : slack_redirect_uri
    });

    var options = {
      method : "POST",
      headers : {
        "Content-Type" : "application/x-www-form-urlencoded"
      },
      uri : "https://slack.com/api/oauth.access?" + params
    }

    // get access token & insert into DB
    request(options, function(err, res, d){
      if(err) throw err;
      
      if(JSON.parse(d).ok){
        console.log(d);
        insertToken(JSON.parse(d), row[0].user_id);
        
      }
    })

    
    /*

    var options = {
      method : "POST",
      uri : "/api/slack/channels/get"
    }

    // get slack channels
    request(options, function(err, res, d){
      if(err) throw err;
      console.log(d);
    });

//  }*/
}

function insertToken (d, id){

  Database.upsert(OauthTokens, 
    {
      slack_access : {
        access_token : d.access_token,
        scope : d.scope,
        user_id : d.user_id,
        team_name : d.team_name,
        team_id : d.team_id
      }
    }, id);
}

function getToken (id, cb){
   return OauthTokens.where({"user_id" : id}).then(function(d){
    return cb(d[0].slack_access.access_token, id);
  })
}

function getChannels (token, id) {

  var params = querystring.stringify({
      token : token
    })
  
  var options = {
    method : "GET",
    uri : "https://slack.com/api/channels.list?" + params
  }
  
  // Get channels
  request(options, function(err, res, d){
    if(err) throw err;
    Database.upsert(slackMetaData, 
      {
        channels : JSON.parse(d).channels
      }, id);
    });
}

function getMessageMeta(data){
  messageMetaData.where({'user_id' : data.user_id})
    .then(function(d){
      //if()
    })
}


function postMessage(data){
  


}