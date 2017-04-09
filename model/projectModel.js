'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//modele du **projet**
let ProjectSchema = new Schema({
    // Nom du projet, requis
    name:{type:String, required:true, unique:true, trim:true},
    //Nom du créateur, requis
    creatorName:{type:String, required:true},
    //Description du projet
    description:{type:String},
    //Jours de la semaine du projet
    daysOff:{
        monday:{type:Boolean},
        tuesday:{type:Boolean},
        wednesday:{type:Boolean},
        thursday:{type:Boolean},
        friday:{type:Boolean},
        saturday:{type:Boolean},
        sunday:{type:Boolean},
    },
    // les ressources (nom et coût) du projet
    resources:[{
        name:{type:String},
        cost:{type:Number},
        cost:{type:Number},
        type:{type:String}
    }],
    mileStone:[{
        name:{type:String},
        date:{type:Date}
    }],
    //les taches : nom, description, pourcentage d'accomplissement, date de début, date de fin, et si la tâche est liée, l'id correspondant, ainsi que les ressources reliées 
    tasks:[{
        id:{type:Number},
        name:{type:String},
        desc:{type:String},
        percentageProgress:{type:Number},
        start:{type:Date},
        end:{type:Date},
        linkedTask:[{
            id:{type:Number}
        }],
        resources:[{
            name:{type:String},
            cost:{type:Number},
            type:{type:String}
        }]
    }],
    //l'ensemble de tâche auquel elle est liée
    groupTaks:[{
        name:{type:String},
        start:{type:Date},
        end:{type:Date}
    }],
    //les utilisateurs affectés
    users:[{
        pseudo:{type:String}
    }]
});

module.exports = mongoose.model('Project', ProjectSchema);