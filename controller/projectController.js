'use strict';

const express       = require('express')
const router        = express.Router();
const projectModel  = require('../model/projectModel');
const userModel     = require('../model/userModel');

const mongoose      = require('mongoose');
                    
router.post("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/post");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    //console.log(req.body);
    
    userModel.find({name:req.body.creatorName}, (err, result)=>{
        if(err){
            console.log(err);
            console.log("erreur");
            res.status(409);
            res.end();
        }
        else
        {
            console.log("success");
            //console.log(result);
        
            let pseudos = '[{';
            
            for(var i = 0; i < req.body.participants.length; i++)
            {
                if(i != 0)
                {
                    pseudos += ", ";
                }
                
                pseudos += "\"pseudo\":\"" + req.body.participants[i].pseudo + "\"";
            }
            
            pseudos += "}]";
            
            //console.log(pseudos);
            
            let project = new projectModel({
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
    
            project.save((err) => {
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
                    //console.log(project);
                    res.end();
                }
            });
        }
    });
});

router.get("/:name", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/get (all by user (owner) name)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    let pseudo = req.url.split("/")[1];
    
    projectModel.find({creatorName:pseudo}, (err, result) => {
        if(err) console.log("erreur dans le get all");
        res.status(200);
        res.json(result);
        res.end();
    });
});

router.get("/shared/:name", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/get (all project shared by user name)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    let lePseudo = req.url.split("/")[2];
    
    //console.log(lePseudo);
    projectModel.find({'users.pseudo' : lePseudo}, (err, result) => {
        if(err)
        {
            console.log("erreur dans le get all");
            
            res.status(200);
            res.end();
        }
        else
        {
            res.status(200);
            //console.log(result);
            res.json(result);
            res.end();
        }
        
    });
});

router.delete("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/delete");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    //console.log(req.body);
    
    projectModel.remove({_id:req.body.id}, (err) => {
        if(err){
            console.log("erreur dans la suppression");
            
            res.status(409);
            res.end();
        }
        else
        {
            console.log("Projet supprimé");
            res.status(200);
            res.end();
        }
    })
});

router.put("/description", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/updateDescription");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    projectModel.findOne({_id:req.body.id}, (err, project) => {
        if(err)
        {
            console.log("erreur");
            res.status(409);
            res.end();
        }
        else
        {
            //console.log(project.name);
            
            project.description = req.body.description;
          
            project.save((err, updatedProject) => {
            if (err){
                console.log("Erreur");
                console.log(err);
                
                res.status(409);
                res.end();
            }
            else
            {
                console.log("Projet modifié dans la base");
                res.status(200);
                //console.log(updatedProject);
                res.end();
            }
          });
          
        }
    });
});

router.put("/daysoff", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/updateDaysOff");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    projectModel.findOne({_id:req.body.id}, (err, project) => {
        if(err)
        {
            console.log("erreur");
            res.status(409);
            res.end();
        }
        else
        {
            //console.log(project.name);
            
            project.daysOff = req.body.daysOff;
          
            project.save((err, updatedProject) => {
            if (err){
                console.log("Erreur");
                console.log(err);
                
                res.status(409);
                res.end();
            }
            else
            {
                console.log("Projet modifié dans la base");
                res.status(200);
                //console.log(updatedProject);
                res.end();
            }
          });
          
        }
    });
});

router.put("/resources", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/updateResources");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    projectModel.findOne({_id:req.body.id}, (err, project) => {
        if(err)
        {
            console.log("erreur");
            res.status(409);
            res.end();
        }
        else
        {
            //console.log(project.name);
            
            project.resources = req.body.resources;
          
            project.save((err, updatedProject) => {
            if (err){
                console.log("Erreur");
                console.log(err);
                
                res.status(409);
                res.end();
            }
            else
            {
                console.log("Projet modifié dans la base");
                res.status(200);
                //console.log(updatedProject);
                res.end();
            }
          });
          
        }
    });
});

router.put("/milestone", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/updateMileStone");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    projectModel.findOne({_id:req.body.id}, (err, project) => {
        if(err)
        {
            console.log("erreur");
            res.status(409);
            res.end();
        }
        else
        {
            //console.log(project.name);
            
            project.mileStone = req.body.milestone;

            project.save((err, updatedProject) => {
            if (err){
                console.log("Erreur");
                console.log(err);
                
                res.status(409);
                res.end();
            }
            else
            {
                console.log("Projet modifié dans la base");
                res.status(200);
                //console.log(updatedProject);
                res.end();
            }
          });
          
        }
    });
});

router.put("/tasks", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/updateTasks");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    projectModel.findOne({_id:req.body.id}, (err, project) => {
        if(err)
        {
            console.log("erreur");
            res.status(409);
            res.end();
        }
        else
        {
            //console.log(project.name);
            
            project.tasks = req.body.tasks;

            project.save((err, updatedProject) => {
            if (err){
                console.log("Erreur");
                console.log(err);
                
                res.status(409);
                res.end();
            }
            else
            {
                console.log("Projet modifié dans la base");
                res.status(200);
                console.log(updatedProject);
                res.end();
            }
          });
          
        }
    });
});

module.exports = router;