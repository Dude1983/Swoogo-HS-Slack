/*
 *    - -       API FOR HUBSPOT RELATED REQs  - -     *//*
 *           
 */


//    - -   REQUIRED MODULES    - -     //

var express = require('express');
var ejs = require('ejs');
var passport = require('passport');


//    - -   APP MODULES  - -     //

/*
 *  @param Database {} mongoDb connection
 *  @param User {} mongoDb schema for User creds
 *  @param OauthTokens {} mongoDb schema for Oauth tokens
 */

var Database = require('../../database/db')();
var User = require('../../database/models/user');
var OauthTokens = require('../../database/models/OauthTokens');
var hubspotMetaData = require('../../database/models/hubspotMetaData');
var messageMetaData = require('../../database/models/messageMetaData');


//    - -   REQUIRED METHODS  - -     //

var hsUtils = require('../../classes/hs_utils');
var slackUtils = require('../../classes/slack_utils');

var router = express.Router();


router.use(function(req, res, next){
	next();
})

/*
 *    - -   GET REQUESTS     - -     *//*
 */
router.get('/', function(req, res){
	

  // TO-DO check cookie in req.headers to confirm auth
  if(!req.user){
    res.redirect('/login');
  } else {
  
    res.end();
  }
});

// returns cached properties from DB
router.get('/properties', function(req, res){
  if(!req.user){
    res.redirect('/login');
  } else {
    hubspotMetaData.where({'user_id' : req.user.id}).then(function(d){
      res.status(200).send(
        {
          property_group : d[0].property_group,
          properties : d[0].properties,
          selected_properties : d[0].selected_properties
        });
      res.end();
    });
  }
});

/*
 *    - -   POST REQUESTS     - -     *//*
 */

router.post('/lead', function(req, res){
  
  var authHeader, orgId, orgSecret, properties, row;

  authHeader = new Buffer(req.headers.authorization.toString().split(' ')[1], 'base64').toString('ascii');
  orgId = authHeader.split(':')[0];
  orgSecret = authHeader.split(':')[1];

  properties = req.body.properties;

  messageMetaData.where({ 'organization.username' : orgId, 'organization.password' : orgSecret}).then(function(d){
    console.log(d);
    org = d[0].organization;
    if(!d.length){
      res.status(401).end();
    } else {
      hsUtils.formatNewLeadPostBody(properties);
      res.status(200).end();
    }
  });

});

// updates cached default properties
router.post('/properties/default', function(req, res){

  req.body.default_properties.forEach(function(d){
      
      name = `properties.${d.name}.default_selection`;
      data = {};
      data[name] = d.default_selection;

      if(d.default_selection === true || d.default_selection === 'true'){
        messageMetaData.update({user_id : req.user.id},
          {
            $push : { selected_properties : d.name }
          }, function(err){
            if(err) console.log(err);
          });
      } else {

        messageMetaData.update({user_id : req.user.id},
          {
            $pull : { selected_properties : d.name }
          }, function(err){
            if(err)console.log(err);
          });
      }
      
      Database.upsert(hubspotMetaData, data, req.user.id);

  });
    
  res.status(200).end();
});

module.exports = router;
