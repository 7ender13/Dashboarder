'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//modele des **utilisateurs**
let UserSchema = new Schema({
    //Nom
    name:{type:String},
    //Prenom
    surname:{type:String},
    //Pseudo, unique et requis
    pseudo:{type:String, required:true, unique:true, trim:true},
    //Mot de passe, requis
    password:{type:String, required:true},
    //Email, unique et requis
    email:{type:String, unique:true, required:true},
    //Nom des projets
    projects:[{
        name:{type:String}
    }],
    service:{type:String}
});

module.exports = mongoose.model('User', UserSchema);