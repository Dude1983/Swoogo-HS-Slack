var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var hsToken = new Schema({
  user_id : String,
  hs_access : {
    access_token: String,
    refresh_token: String,
    refreshed : {type : Date} 
  } 
});	

module.exports = mongoose.model('hsToken', hsToken);