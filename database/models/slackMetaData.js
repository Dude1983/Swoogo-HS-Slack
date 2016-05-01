var mongoose = require('mongoose'),
    Schema = mongoose.Schema



var slackMetaData = new Schema({
	user_id : String,
	default_channel : String,
	channels : Array
});	





module.exports = mongoose.model('slackMetaData', slackMetaData);