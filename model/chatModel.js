'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ChatSchema = new Schema({
    projectID:String,
    participant:[{username:String, status:Boolean}],
    messages:[{from:String, message:String}]
});

module.exports = mongoose.model('Chat', ChatSchema);