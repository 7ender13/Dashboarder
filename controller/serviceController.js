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