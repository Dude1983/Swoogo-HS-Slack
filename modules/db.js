var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// Private

var TABLE = process.env["DB"];
var USR = process.env["DB_USR"];
var KEY = process.env["DB_PASS"];


// Public

module.exports = DB;


function DB (){
  return new Database();
}

function Database(){



  this.URI = "mongodb://" + USR + ":" + KEY + TABLE;
  return this;
}


Database.prototype.init = function  (){

  Database = this;

  // connect to mongoDb
  mongoose.connect(Database.URI);

  db = mongoose.connection;

  // CONNECTION EVENTS
  // When successfully connected
  db.on('connected', function () {  
    console.log('Mongoose default connection open to ' + Database.URI);
  }); 

  // If the connection throws an error
  db.on('error',function (err) {  
    console.log('Mongoose default connection error: ' + err);
  }); 

  // When the connection is disconnected
  db.on('disconnected', function () {  
    console.log('Mongoose default connection disconnected'); 
  });

  // If the Node process ends, close the db 
  process.on('SIGINT', function() {  
    db.close(function () { 
      console.log('Mongoose default connection disconnected through app termination'); 
      process.exit(0); 
    }); 
  }); 

}

Database.prototype.entry = function (data){

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

  var SESSION = mongoose.model('SESSION', SESSION_SCHEMA);

  var session = new SESSION({
    cookie: "bllooop" ,
    hs_access : {
      api_key : "bllooop",
      refresh_token : "bllooop"
    }
  })

  session.save(function(err, user1){
    if(err) throw err;
    console.log(user1);
  })
  
}