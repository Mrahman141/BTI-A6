var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    "userName": {type:String, unique:true},
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent": String
    }]
  });

  let User; // to be defined on new connection


function initialize(){

    return new Promise(function (resolve, reject) {

        User=mongoose.createConnection('mongodb+srv://fahim:Aminoor123@bti-database.rlmjtmr.mongodb.net/A5_database');
        User.once('Open', ()=>{
            //User.model("users", userSchema);
            resolve();
        });

        User.on('error', (err)=>{
            reject(err);
        });

    });

}

function registerUser(userData){

    return new Promise(function (resolve, reject) {

    });
}

function checkUser(userData){

    return new Promise(function (resolve, reject) {

    });
}



exports.initialize = initialize;
exports.initialize = registerUser;
exports.checkUser  = checkUser;
