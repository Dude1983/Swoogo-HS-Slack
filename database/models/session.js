var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SESSION_SCHEMA = new Schema({
  user_ID : Schema.Types.ObjectId,
  cookie : String,
  expires : { type: Date, expires: '24h' },
  hs_access : {
    api_key : String,
    refresh_token : String,
    expires: { type: Date, expires: 28800 / 1000}
  }
});

var Session = module.exports = mongoose.model('SESSION', SESSION_SCHEMA);