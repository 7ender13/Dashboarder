'use strict';

const express   = require('express')
const objectID  = require('objectid')
const router    = express.Router();

const chatModel = require('../model/todoModel');
const mongoose  = require('mongoose');

router.get("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("todo/get (all)");
    console.log("-->-->-->-->-->-->-->-->-->--");

    //let idProject = req.url.split("/")[1];

    /*todoModel.find({projectID:idProject}, (err, result) => {
        if(err)
        {
            console.log("Erreur");

            res.status(409);
            res.end();
        }
        else
        {
            res.status(200);
            res.json(result);
            //console.log(result);
            res.end();
        }
    });*/
    res.status(200);
    res.json({});
    res.end();
});

module.exports = router;
