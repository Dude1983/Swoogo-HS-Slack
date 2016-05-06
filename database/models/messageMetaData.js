var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var messageMetaData = new Schema({
	user_id : String,
	organization : {
		username : String,
		password : String
	},
	default_channel : String,
	selected_properties : ['firstname', 'lastname', 'email', 'phone'],
	isOwned : Boolean
});	

module.exports = mongoose.model('messageMetaData', messageMetaData);