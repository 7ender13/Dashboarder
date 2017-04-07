'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ChatSchema = new Schema({
    projetID:{type:Schema.Types.ObjectId, required:true, unique:true, trim:true},
    userPseudo:{type:String, required:true},
    message:{type:String, required:true}
});

module.exports = mongoose.model('Chat', ChatSchema);