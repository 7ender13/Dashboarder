'use strict';

const express   = require('express')
const objectID   = require('objectid')
const router    = express.Router();

const chatModel  = require('../model/chatModel');

const mongoose      = require('mongoose');


router.get("/:id", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("chat/get (by id)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    let idProject = req.url.split("/")[1];
    chatModel.find({projectID:idProject}, (err, result) => {
        if(err) console.log("erreur dans le get all");
        
        console.log(result);
        
        res.status(200);
        res.json(result);
        res.end();
    });
});

router.post("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("chat/post");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    console.log(req.body);
    var chat = new chatModel(req.body);
    
    chat.save(function (err) {
        if (err) 
        { 
            res.status(500);
            console.log("erreur");
            console.log(err);
            res.end();
        }
        else
        {
            res.status(200);
            console.log('Ajouté dans mongoDB !');
            console.log(chat);
            res.end();
        }
    });
    
    
});

module.exports = router;