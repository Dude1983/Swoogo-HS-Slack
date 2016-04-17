var mongoose = require('mongoose');

// Private

var TABLE = process.env["DB"];
var USR = process.env["DB_USR"];
var KEY = process.env["DB_PASS"];
var SESSION = require('./schema');
var dbURI = "mongodb://" + USR + ":" + KEY + TABLE;

// Public

module.exports = DB;


function DB (){
  return new Database();
}

function Database(){

  if (typeof(Database) === "object") {
    return Database;
  }
  
  this.table = TABLE;
  this.db = mongoose.connection;

  return this;

}


Database.prototype.init = function  (data, cb){

  var Database = this;
  var db = Database.db;
  
  // connect to mongoDb
  mongoose.connect(dbURI);

  // CONNECTION EVENTS
  // When successfully connected
  db.on('connected', cb); 

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

Database.prototype.insert = function (data){

  var Database = this;
  var db = Database.db;

  Database.init(data, function(){
    console.log('Mongoose default connection open to ' + Database.table);
    console.log("Inserting: " + data);

        /*var session = new SESSION({
      cookie:  ,
      hs_access : {
        api_key : ,
        refresh_token : 
      }
    });

    session.save(function(err, user1){
      if(err) throw err;
      console.log(user1);
    });*/


  });

}

Database.prototype.close = function(){
  
  var Database = this;
  var db = Database.db;

  db.close();
}