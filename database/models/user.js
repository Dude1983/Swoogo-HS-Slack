var mongoose = require('mongoose'),
    Schema = mongoose.Schema
    passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
	username : String,
	password : String
});	

var Options = {
	usernameUnique : true,
	maxAttempts: 3,
	errorMessages : {
		MissingPasswordError : "You must enter a Password",
		TooManyAttemptsError : "Account locked due to too many failed login attempts",
		IncorrectPasswordError : "Password or username are incorrect",
		IncorrectUsernameError : "Password or username are incorrect",
		MissingUsernameError : "You must enter a Username",
		UserExistsError : "A user with the given username is already registered"
	}
}

User.plugin(passportLocalMongoose, Options);


module.exports = mongoose.model('User', User);