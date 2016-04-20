var request = require('request');
var querystring = require('querystring');

var options = {
	method: "POST",
	uri : "https://api.hubapi.com/auth/v1/refresh",
	body: querystring.stringify({
		refresh_token: "fd5f8ff7-02e5-46a9-99da-29dfcbf6fc4b",
		client_id :"973a83bb-03e4-11e6-9653-93a39db85acf",
		grant_type : "refresh_token"
	})
}


request(options, function(err, res, d){
	if(err) console.log(err);
	else{
		console.log(d);
	}
})