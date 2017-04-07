'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    name:{type:String},
    surname:{type:String},
    pseudo:{type:String, required:true, unique:true, trim:true},
    password:{type:String, required:true},
    email:{type:String, required:true},
    projects:[{
        name:{type:String}
    }]
});

module.exports = mongoose.model('User', UserSchema);