var mongoose = require('mongoose');

// Private

var TABLE = process.env["DB"];
var USR = process.env["DB_USR"];
var KEY = process.env["DB_PASS"];

var dbURI = "mongodb://" + USR + ":" + KEY + TABLE;

// Public

module.exports = DB;


function DB (){
  return new Database();
}

function Database(){

  if (typeof(Database) === "object"){
    return Database;
  }

  this.table = TABLE;
  this.connection = mongoose.connection;

  return this;

}


Database.prototype.init = function  (){

  var Database = this;
  var connection = Database.connection;
  
  // connect to mongoDb
  mongoose.connect(dbURI);

  // CONNECTION EVENTS
  // When successfully connected
  connection.on('connected', function(){
    console.log("Mongoose default connection opened to: " + Database.table);
  }); 

  // If the connection throws an error
  connection.on('error',function (err) {  
    console.log('Mongoose default connection error: ' + err);
  }); 

  // When the connection is disconnected
  connection.on('disconnected', function () {  
    console.log('Mongoose default connection disconnected'); 
  });

  // If the Node process ends, close the db 
  process.on('SIGINT', function() {  
    connection.close(function () { 
      console.log('Mongoose default connection disconnected through app termination'); 
      process.exit(0); 
    }); 
  }); 
}

Database.prototype.insert = function (data){

  var Database = this;
  var connection = Database.connection;


    var row = new SESSION({
      cookie:  data.cookie,
      hs_access : {
        api_key : "098025-=asgdaklj",
        refresh_token : "098025-=asgdaklj" 
      }
    });

    row.save(function(err, row){
      if(err) throw err;
      console.log("logged new row: " + row);
    }).then(function(doc){
      console.log(doc);
    });

}



Database.prototype.close = function(){
  
  var Database = this;
  var connection = Database.connection;

  connection.close();


}