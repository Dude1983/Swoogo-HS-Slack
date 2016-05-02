var mongoose = require('mongoose'),
    Schema = mongoose.Schema



var hubspotMetaData = new Schema({
	user_id : String,
	properties : Array,
	selected_properties : Array
});	





module.exports = mongoose.model('hubspotMetaData', hubspotMetaData);