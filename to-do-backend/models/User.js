const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    googleId:{type:String, default:null},
    twoFactorSecret:{type:String, default:null},
    isTwoFactorEnabled:{type:Boolean, default:false}
});

module.exports = mongoose.model('User', UserSchema);