var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    passportLocalMongoose = require('passport-local-mongoose');



var messageMetaData = new Schema({
	user_id : String,
	organization : {
		username : String,
		password : String
	},
	default_channel : String,
	selected_properties : Array
});	


messageMetaData.plugin(passportLocalMongoose);


module.exports = mongoose.model('messageMetaData', messageMetaData);