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

client.on('projectUpdated', (data) => {
    console.log('projectUpdated');
    console.log(data);
    updateProject(data);
});

router.get("/:name", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("service/get (all except name)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    let nameOfMyService = req.url.split("/")[1];
    
    serviceModel.find({nameService:{$not:nameOfMyService}}, (err, result) => {
        if(err)
        {
            console.log("erreur dans le get");
            console.log(err);
            res.status(409);
            res.end();
        }
        else
        {
            res.status(200);
            res.json(result);
            res.end();
        }
        
    });
});


function updateProject(data)
{
    for(var i = 0; i < data.length; i++)
    {
        console.log(data[i]);
        let service = new serviceModel({
            nameService:data[i].nameOfService,
            projects:data[i].projects
        });
        
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