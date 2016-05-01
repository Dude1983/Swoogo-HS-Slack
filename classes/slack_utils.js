
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

var OauthTokens = require('../database/models/OauthTokens');
var Database = require('../database/db.js');


//    - -   EXPORTS     - -     //

module.exports.Oauth = Oauth;
module.exports.getToken = getToken;
module.exports.insertToken = insertToken;
module.exports.authTest = authTest;
module.exports.listChannels = listChannels;


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


function authTest (token) {

}


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
    })

    var options = {
      method : "POST",
      headers : {
        "Content-Type" : "application/x-www-form-urlencoded"
      },
      uri : "https://slack.com/api/oauth.access?" + params
    }


    request(options, function(err, res, d){
      if(err) throw err;
      
      if(JSON.parse(d).ok){
        console.log(d);
        insertToken(JSON.parse(d), row[0].user_id);
        
      }
    })

    var options = {
      method : "POST",
      body : {
        get_channels : true
      },
      uri : "/api/slack"
    }


    request(options, function(err, res, d){
      if(err) throw err;
      console.log(d);
    });

//  }
}

function insertToken (d, id){

  OauthTokens.update({ "user_id" :  id}, 
    { $set : {
        slack_access : {
          access_token : d.access_token,
          scope : d.scope,
          user_id : d.user_id,
          team_name : d.team_name,
          team_id : d.team_id
        }
      }
    }, { upsert : true },
    function(err){
      if(err){
        console.log(err);
      } 
    });
}

function getToken (id, cb){
   return OauthTokens.where({"user_id" : id}).then(function(d){
    return cb(d[0].slack_access.access_token, id);
  })
}

function listChannels (token, id) {

  var params = querystring.stringify({
      token : token
    })
  
  var options = {
    method : "GET",
    uri : "https://slack.com/api/channels.list?" + params
  }
  request(options, function(err, res, d){
    if(err) throw err;
    mongoose.models.slackMetaData.update({ "user_id" :  id},
      { $set : 
        {
          channels : JSON.parse(d).channels
        }
      }, { upsert : true },
    function(err){
      if(err){
        console.log(err);
      } 
    })
  })
}