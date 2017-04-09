'use strict';

const express   = require('express')
const router    = express.Router();
const userModel = require('../model/userModel');
const mongoose  = require('mongoose');

//Controller **User**

// Méthode `GET` retourne tous les utilisateurs
router.get("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("user/get (all)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    // On récupère les utilisateurs de la base
    userModel.find({}, (err, result) => {
        if(err) 
        {
            //si on ne trouve pas, retourne erreur `HTTP` 409 : CONFLICT
            console.log("erreur dans le get all");
            res.status(409);
            res.end();
        }
        else
        {
            //sinon, on retourne `HTTP` 200 : OK avec le résultat
            res.status(200);
            res.json(result);
            res.end();   
        }
    });
});

// Méthode `GET` recupère l'_utilisateur_ par pseudo
router.get("/:pseudo", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("user/get (by pseudo)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    // On récupère le 1er paramètre de l'`URL`, le _pseudo_ en question
    let pseudo = req.url.split("/")[1];
    
    // On recherche l'utilisateur qui a ce pseudo
    userModel.findOne({pseudo:pseudo}, (err, result) => {
        if(err) 
        {
            console.log("erreur dans le get all");
             //si erreur, retourne erreur `HTTP` 409 : CONFLICT
            res.status(409);
            res.json(result);
        }
        else
        {
            //sinon, on retourne `HTTP` 200 : OK avec l'utilisateur
            res.status(200);
            res.json(result);
            res.end();    
        }
    });
});

// Méthode `GET` recupère l'_utilisateur_ par _pseudo_ et _mot de passe_
router.get("/:pseudo/:password", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("user/get (by pseudo and password)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    // On récupère le 1er (/pseudo) paramètre de l'`URL`, le _pseudo_
    let pseudo = req.url.split("/")[1];
    // On récupère le 2ème (/pseudo/password) paramètre de l'`URL`, le _mot de passe_
    let password = req.url.split("/")[2];
    
    // On recherche l'utilisateur qui a ce pseudo et ce mdp
    userModel.findOne({pseudo:pseudo,password:password}, (err, result) => {
        if(err) {
            //si erreur, retourne erreur `HTTP` 409 : NON AUTHORIZED
            console.log("erreur dans le get user by idents");
            res.status(405);
        }
        else{
            //sinon, on retourne `HTTP` 200 : OK avec l'utilisateur
            res.status(200);
            res.json(result);
        }
        res.end();
    });
});

// Méthode `POST` permet de créer un _utilisateur_
router.post("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("user/post");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    
    // on formatte un _utilisateur_ avec notre _modèle_ grâce au corps de la requête
    let user = new userModel({name: req.body.name, surname: req.body.surname, pseudo: req.body.pseudo, password:req.body.password, email:req.body.email });
    
    // On sauvegarde l'_utilisateur_ créé
    user.save((err) => {
        if (err) 
        { 
            //si erreur lors de la sauvegarde de l'_utilisateur_, retourne erreur `HTTP` 409 : CONFLICT
            res.status(409);
            console.log("Erreur");
            console.log(err);
            res.end();
        }
        else
        {
            //sinon retourne `HTTP` 200 : OK
            res.status(200);
            console.log('Utilisateur ' + req.body.pseudo + ' ajouté dans mongoDB !');
            console.log(user);
            res.end();
        }
    });
    
});

// Méthode `PUT` permet de mettre à jour un _utilisateur_ par son email
router.put("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("user/update");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    // on cherche l'utilisateur dans la base qui a l'_email_ passé dans le corps de la requête
    userModel.findOne({email:req.body.email}, (err, result) => {
        if(err)
        {
            //si on ne trouve pas, retourne erreur `HTTP` 409 : CONFLICT
           console.log("erreur");
            res.status(409);
            res.end();
        }
        else
        {
            //on cherche l'utilisateur dans la base qui a l'_id_ passé par la recherche précédente
            userModel.findById(result.id, (err, user) => {
              if (err){
                console.log("erreur");
                console.log(err);
                //si on ne trouve pas, retourne erreur `HTTP` 409 : CONFLICT
                res.status(409);
                res.end();
              } 
          
              // le pseudo est passé dans le corps de la requête
              user.pseudo = req.body.pseudo;
              
              // on sauvegarde l'utilisateur en question
              user.save((err, updatedUser) => {
                if (err){
                    console.log("Erreur");
                    console.log(err);
                    //si erreur, retourne erreur `HTTP` 409 : CONFLICT
                    res.status(409);
                    res.end();
                }
                else
                {
                    //sinon, on retourne `HTTP` 200 : OK
                    console.log("Utilisateur modifié dans la base");
                    res.status(200);
                    res.end();
                }
              });
            });
        }
    });
});

// Méthode `DELETE` supprime l'utilisateur par son pseudo
router.delete("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("user/delete");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    // on cherche l'utilisateur dans la base qui a le _pseudo_ passé dans le corps de la requête
    userModel.remove({pseudo:req.body.pseudo}, (err) => {
        if(err) 
        {
            console.log("erreur");
             //si on ne trouve pas, retourne erreur `HTTP` 409 : CONFLICT
            res.status(409);
            res.end();
        }
        else
        {
            //sinon, on retourne `HTTP` 200 : OK
            res.status(200);
            res.end();
        }
    })
});

module.exports = router;
