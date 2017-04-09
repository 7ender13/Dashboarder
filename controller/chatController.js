'use strict';

const express   = require('express')
const objectID  = require('objectid')
const router    = express.Router();

const chatModel = require('../model/chatModel');
const mongoose  = require('mongoose');

//Controller **Chat**

// Méthode `GET` par _ID_ du chat
router.get("/:id", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("chat/get (by id)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    // On récupère le 1er paramètre de l'`URL`, l'_id_ du _projet_
    let idProject = req.url.split("/")[1];
    
    // On récupère le chat relié au projet
    chatModel.find({projectID:idProject}, (err, result) => {
        if(err)
        {
            console.log("Erreur");
            //si erreur, retourne erreur `HTTP` 409 : CONFLICT
            res.status(409);
            res.end();
        }
        else
        {
            //sinon retourne `HTTP` 200 : OK
            res.status(200);
            res.json(result);
            //console.log(result);
            res.end();
        }
    });
});

// Méthode `POST`  permet de créer un chat
router.post("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("chat/post");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    // on formatte un chat avec notre modèle grâce au corps de la requête
    let chat = new chatModel(req.body);
    
    // On sauvegarde le chat créé
    chat.save((err) => {
        if (err) 
        { 
            //si erreur lors de la sauvegarde du _chat_, retourne erreur `HTTP` 409 : CONFLICT
            res.status(409);
            console.log("erreur");
            console.log(err);
            res.end();
        }
        else
        {
            //sinon retourne `HTTP` 200 : OK
            res.status(200);
            console.log('Ajouté dans mongoDB !');
            
            res.end();
        }
    });
});

module.exports = router;