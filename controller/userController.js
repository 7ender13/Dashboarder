'use strict';

const express   = require('express')
const router    = express.Router();

const userModel  = require('../model/userModel');

const mongoose      = require('mongoose');

router.get("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("user/get (all)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    userModel.find({}, function(err, result){
        if(err) console.log("erreur dans le get all");
        res.status(200);
        res.json(result);
        res.end();
    });
});

router.get("/:pseudo", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("user/get (by pseudo)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    let pseudo = req.url.split("/")[1];
    
    userModel.findOne({pseudo:pseudo}, function(err, result){
        if(err) console.log("erreur dans le get all");
        res.status(200);
        res.json(result);
        res.end();
    });
});

router.get("/:pseudo/:password", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("user/get (by pseudo and password)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    let pseudo = req.url.split("/")[1];
    let password = req.url.split("/")[2];
    
    userModel.findOne({pseudo:pseudo,password:password}, function(err, result){
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
    
    console.log(req.body);
    var user = new userModel({name: req.body.name, surname: req.body.surname, pseudo: req.body.pseudo, password:req.body.password, email:req.body.email });
    
    user.save(function (err) {
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
            console.log('Utilisateur ' + req.body.pseudo + ' ajouté dans mongoDB !');
            console.log(user);
            res.end();
        }
    });
    
    
});

router.put("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("user/update");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    userModel.findOne({email:req.body.email}, function(err, result){
        if(err) console.log("erreur dans le put");
        
        console.log(result._id);
        userModel.findById(result.id, function (err, user) {
          if (err){
            console.log("erreur");
            console.log(err);
            res.status(404);
            res.end();
          } 
          
          user.pseudo = req.body.pseudo;
          
          user.save(function (err, updatedUser) {
            if (err){
                console.log("erreur");
                console.log(err);
                res.status(409);
                res.end();
            }
            console.log("ok");
            console.log(updatedUser);
            res.status(200);
            res.end();
          });
        });
    });
 
    
    
});


router.delete("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("user/delete");
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log(req.body);
    
    userModel.remove({pseudo:req.body.pseudo}, function(err){
        if(err) console.log("erreur dans la suppression");
    })
    
    res.status(200);
    res.end();
});

module.exports = router;
