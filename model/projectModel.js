'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ProjectSchema = new Schema({
    name:{type:String, required:true, unique:true, trim:true},
    creatorName:{type:String, required:true},
    description:{type:String},
    daysOff:{
        monday:{type:Boolean},
        tuesday:{type:Boolean},
        wednesday:{type:Boolean},
        thursday:{type:Boolean},
        friday:{type:Boolean},
        saturday:{type:Boolean},
        sunday:{type:Boolean},
    },
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
    groupTaks:[{
        name:{type:String},
        start:{type:Date},
        end:{type:Date}
    }],
    users:[{
        pseudo:{type:String}
    }]
});

module.exports = mongoose.model('Project', ProjectSchema);