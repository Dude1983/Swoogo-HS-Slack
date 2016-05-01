var mongoose = require('mongoose'),
    Schema = mongoose.Schema



var messageMetaData = new Schema({
	user_id : String,
	default_channel : String,
	selected_properties : Array
});	





module.exports = mongoose.model('messageMetaData', messageMetaData);