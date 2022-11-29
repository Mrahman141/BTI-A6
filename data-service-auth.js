


var mongoose = require("mongoose");
const bcrypt = require('bcrypt');

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

  let collection;
  let User; // to be defined on new connection


function initialize(){

    
    return new Promise(function (resolve, reject) {

        collection=mongoose.createConnection('mongodb+srv://fahim:Aminoor798@bti-database.rlmjtmr.mongodb.net/A6');
        
        collection.on('error', (err)=>{
            reject(err);
        });

        collection.once('open', ()=>{
            User=collection.model("users", userSchema);
            resolve();
        });

    });

}

function registerUser(userData){

    return new Promise(function (resolve, reject) {
        if((userData.password=="")||(userData.password2=="")||(userData.password.trim()=="")||(userData.password2.trim()=="")){
            reject("Error: user name cannot be empty or only white spaces! ");
        }
        else if(userData.password != userData.password2){
            reject("Error: Passwords do not match");
        }
        else{
            let newUser = new User(userData);
            newUser.save().then(()=>{
                resolve();
            }).catch((err)=>{
                if(err.code == 11000){
                    reject("User Name already taken");
                }
                else{
                    reject("There was an error creating the user:"+err);
                }
            });
        }
    });
}

function checkUser(userData){

    return new Promise(function (resolve, reject) {
        User.findOne({userName: userData.userName}).exec().then((user)=>{
            if(user=={})
            {
                reject("Unable to find user: " + user.userName);
            }
            else if(user.password != userData.password){
                reject("Incorrect Password for user:" + user.userName);
            }
            else{
                user.loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                User.updateOne({userName: user.userName},{$set:{loginHistory: user.loginHistory}}).exec().then(()=>{
                    resolve(user);
                }).catch((err)=>{
                    reject("There was an error verifying the user:" + err);
                });
            }
        }).catch(()=>{
            reject("Unable to find user:" + userData.userName);
        });
    });
}



exports.initialize = initialize;
exports.registerUser = registerUser;
exports.checkUser  = checkUser;
