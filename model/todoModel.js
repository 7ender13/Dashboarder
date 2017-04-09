'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let todoSchema = new Schema({
    projectID:String,
    done:Boolean,
    task:String
});

module.exports = mongoose.model('Todo', todoSchema);
