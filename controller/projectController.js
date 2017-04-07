'use strict';

const express   = require('express')
const router    = express.Router();

const projectModel  = require('../model/projectModel');
const userModel     = require('../model/userModel');

const mongoose      = require('mongoose');

router.post("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/post");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    console.log(req.body);
    
    userModel.findById(req.body.creatorID, (err, result)=>{
        if(err){
            console.log(err);
            console.log("erreur");
            res.status(409);
            res.end();
            
        }
        else
        {
            console.log("success");
            console.log(result);
        
            var pseudos = '{';
            for(var i = 0; i < req.body.participants.length; i++)
            {
                if(i != 0)
                {
                    pseudos += ", ";
                }
                userModel.findById(req.body.participants[i].id, (err, result) => {
                    if(err){
                        console.log("erreur");
                        console.log(err);
                    }
                    pseudos += "pseudo";
                    console.log("azeaze");
                    
                });
            }
            
            pseudos += "}";
            
            console.log("test");
            console.log(pseudos);
            
            var project = new projectModel({
                name:req.name,
                creatorName:result.name,
                description:req.description,
                
                });
    
            // project.save(function (err) {
            //     if (err) 
            //     { 
            //         res.status(500);
            //         console.log("erreur");
            //         console.log(err);
            //         res.end();
            //     }
            //     else
            //     {
            //         res.status(200);
            //         console.log('Projet Ajouté dans mongoDB !');
            //         console.log(project);
            //         res.end();
            //     }
            // });
            
            res.status(200);
            res.end();
        }
    });
});



module.exports = router;