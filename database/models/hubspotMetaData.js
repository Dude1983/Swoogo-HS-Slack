var mongoose = require('mongoose'),
    Schema = mongoose.Schema



var hubspotMetaData = new Schema({
	user_id : String,
	property_group : Array,
	properties : Object
});	





module.exports = mongoose.model('hubspotMetaData', hubspotMetaData);