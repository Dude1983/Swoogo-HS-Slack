var mongoose = require('mongoose'),
    Schema = mongoose.Schema



var hubspotMetaData = new Schema({
	user_id : String,
	channels : Array
});	





module.exports = mongoose.model('hubspotMetaData', hubspotMetaData);