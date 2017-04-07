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
        
            var pseudos = '[{';
            for(var i = 0; i < req.body.participants.length; i++)
            {
                if(i != 0)
                {
                    pseudos += ", ";
                }
                
                pseudos += "\"pseudo\":\"" + req.body.participants[i].pseudo + "\"";
            }
            
            pseudos += "}]";
            
            console.log(pseudos);
            
            var project = new projectModel({
                name:req.body.name,
                creatorName:req.body.creatorName,
                description:req.body.description,
                daysOff:{},
                resources:[{}],
                mileStone:[{}],
                tasks:[{}],
                groupTaks:[{}],
                users:JSON.parse(pseudos)
                });
    
            project.save(function (err) {
                if (err) 
                { 
                    res.status(409);
                    console.log("erreur");
                    console.log(err);
                    res.end();
                }
                else
                {
                    res.status(200);
                    console.log('Projet Ajouté dans mongoDB !');
                    console.log(project);
                    res.end();
                }
            });
        }
    });
});

module.exports = router;