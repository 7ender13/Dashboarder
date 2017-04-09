'use strict';

const express   = require('express')
const router    = express.Router();
const userModel = require('../model/userModel');
const mongoose  = require('mongoose');

router.get("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("user/get (all)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    userModel.find({}, (err, result) => {
        if(err) 
        {
            console.log("erreur dans le get all");
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

router.get("/:pseudo", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("user/get (by pseudo)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    let pseudo = req.url.split("/")[1];
    
    userModel.findOne({pseudo:pseudo}, (err, result) => {
        if(err) 
        {
            console.log("erreur dans le get all");
            
            res.status(409);
            res.json(result);
        }
        else
        {
            res.status(200);
            res.json(result);
            res.end();    
        }
    });
});

router.get("/:pseudo/:password", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("user/get (by pseudo and password)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    let pseudo = req.url.split("/")[1];
    let password = req.url.split("/")[2];
    
    userModel.findOne({pseudo:pseudo,password:password}, (err, result) => {
        if(err) {
            console.log("erreur dans le get user by idents");
            res.status(405);
        }
        else{
            res.status(200);
        }
        res.json(result);
        res.end();
    });
});

router.post("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("user/post");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    //console.log(req.body);
    let user = new userModel(req.body);
    
    user.save((err) => {
        if (err) 
        { 
            res.status(409);
            console.log("Erreur");
            console.log(err);
            res.end();
        }
        else
        {
            res.status(200);
            console.log('Utilisateur ' + req.body.pseudo + ' ajouté dans mongoDB !');
            //console.log(user);
            res.end();
        }
    });
    
});

router.put("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("user/update");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    userModel.findOne({email:req.body.email}, (err, result) => {
        if(err)
        {
            console.log("erreur");
            res.status(409);
            res.end();
        }
        else
        {
            //console.log(result._id);
            userModel.findById(result.id, (err, user) => {
              if (err){
                console.log("erreur");
                console.log(err);
                
                res.status(409);
                res.end();
              } 
          
              user.pseudo = req.body.pseudo;
              
              user.save((err, updatedUser) => {
                if (err){
                    console.log("Erreur");
                    console.log(err);
                    
                    res.status(409);
                    res.end();
                }
                else
                {
                    console.log("Utilisateur modifié dans la base");
                    res.status(200);
                    res.end();
                }
              });
            });
        }
    });
});

router.delete("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("user/delete");
    console.log("-->-->-->-->-->-->-->-->-->--");
    //console.log(req.body);
    
    userModel.remove({pseudo:req.body.pseudo}, (err) => {
        if(err) 
        {
            console.log("erreur");
            
            res.status(409);
            res.end();
        }
        else
        {
            res.status(200);
            res.end();
        }
    })
});

module.exports = router;
