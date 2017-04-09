'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Modele du **chat**
let ChatSchema = new Schema({
        // id du projet relié au chat
    projectID:String,
        //nom et status par participant
    participant:[{username:String, status:Boolean}],
        //contenu et auteur par message
    messages:[{from:String, message:String}]
});

module.exports = mongoose.model('Chat', ChatSchema);