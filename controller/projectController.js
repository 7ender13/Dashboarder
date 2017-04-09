'use strict';

const express       = require('express')
const router        = express.Router();
const projectModel  = require('../model/projectModel');
const userModel     = require('../model/userModel');
const serviceModel  = require('../model/serviceModel');

const mongoose      = require('mongoose');
const socket        = require('socket.io-client');
let client          = socket.connect('https://c9.seefox.fr', {reconnect: true});

client.on('connect', () => {
  console.log('connected')
});

client.on('info', (data) => {
    console.log('info');
    console.log(data);
});

client.on('projectUpdated', (data) => {
    console.log('-------------------------------');
    console.log('-------------------------------');
    console.log('projectUpdated');
    console.log(data);
    console.log('-------------------------------');
    console.log('-------------------------------');
});


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
                workingHours:{},
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
                    sendUpdate(req.body.nameOfService);
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
        if(err)
        {
            console.log("erreur dans le get all");
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

router.get("/read", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/get (all project in read access)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
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
            //console.log(req.body);
            if(req.body.editorName === project.creatorName)
            {
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
                    sendUpdate(req.body.nameOfService);
                    res.end();
                }
              });
            }
            else
            {
                console.log("Erreur");
                console.log(err);
                
                res.status(401);
                res.end();
            }
            
          
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
            console.log(project);
            
            if(req.body.editorName === project.creatorName)
            {
                project.daysOff = req.body.workingDays.daysOff;
                project.workingHours = req.body.workingDays.workingHours;
              
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
                        sendUpdate(req.body.nameOfService);
                        res.end();
                    }
                });
            }
            else
            {
              console.log("Erreur");
                console.log(err);
                
                res.status(401);
                res.end();  
            }
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
            if(req.body.editorName === project.creatorName)
            {
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
                        sendUpdate(req.body.nameOfService);
                        res.end();
                    }
                });
            }
            else
            {
                console.log("Erreur");
                console.log(err);
                
                res.status(401);
                res.end();
            }
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
            if(req.body.editorName === project.creatorName)
            {
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
                        sendUpdate(req.body.nameOfService);
                        res.end();
                    }
                });
            }
            else
            {
                console.log("Erreur");
                console.log(err);
                
                res.status(401);
                res.end();
            }
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
                //console.log(updatedProject);
                sendUpdate(req.body.nameOfService);
                res.end();
            }
          });
          
        }
    });
});

router.put("/grouptasks", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/updateGroupTasks");
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

            project.groupTasks = req.body.groupTasks;

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
                sendUpdate(req.body.nameOfService);
                res.end();
            }
          });
          
        }
    });
});

router.put("/users", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/updateUsers");
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
            if(req.body.editorName === project.creatorName)
            {
                project.users = req.body.users;

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
                        sendUpdate(req.body.nameOfService);
                        res.end();
                    }
                });
            }
            else
            {
                console.log("Erreur");
                console.log(err);
                
                res.status(401);
                res.end();
            }
        }
    });
});

function sendUpdate(nameOfService)
{
    projectModel.find({}, (err, result)=>{
        
        let service = new serviceModel({
            nameService:nameOfService,
            projects:result
        });
        
        //console.log(service);
        client.emit('sendUpdate', JSON.stringify(service));
    });
}

module.exports = router;