'use strict';

const express   = require('express')
const router    = express.Router();
const mongoose  = require('mongoose');
const serviceModel  = require('../model/serviceModel');
const socket        = require('socket.io-client');
let client          = socket.connect('https://c9.seefox.fr', {reconnect: true});

client.on('connect', () => {
  console.log('connected')
});

client.on('projectaUpdated', (data) => {
    console.log('projectUpdated in serviceController');
    console.log(data);
    updateProject(data);
});

//Controller **SERVICE**

// Méthode `GET` permet de créer un service  avec le nom
router.get("/:name", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("service/get (all except name)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    // On récupère le 1er paramètre de l'`URL`, le _nom_ du service
    let nameOfMyService = req.url.split("/")[1];
    
    // On cherche le _projet_ en question,s'il n'existe pas déjà
    serviceModel.find({nameService:{$not:nameOfMyService}}, (err, result) => {
        if(err)
        {
             //si on en trouve un, on retourne erreur `HTTP` 409 : CONFLICT
            console.log("erreur dans le get");
            console.log(err);
            res.status(409);
            res.end();
        }
        else
        {
            // S'il n'y a pas d'erreur, on retourne un `HTTP` 200 : OK avec le resultat
            res.status(200);
            res.json(result);
            res.end();
        }
        
    });
});

// **fonction** updateProject, permet de mettre à jour le projet concerné
function updateProject(data)
{
    for(var i = 0; i < data.length; i++)
    {
        // on créé un service avec son modèle et les data en paramètre
        console.log(data[i]);
        let service = new serviceModel({
            nameService:data[i].nameOfService,
            projects:data[i].projects
        });
        
        // on sauvegarde le service créé
        service.save((err) => {
            if(err)
            {
                console.log("erreur");
                console.log(err);   
            }
        });
    }
}

module.exports = router;