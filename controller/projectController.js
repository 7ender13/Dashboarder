'use strict';

const express       = require('express')
const router        = express.Router();
const projectModel  = require('../model/projectModel');
const userModel     = require('../model/userModel');

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

//Controller **PROJET**

// Méthode `POST` permet de créer un projet             
router.post("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/post");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    // Recherche du _createur_ du projet
    userModel.find({name:req.body.creatorName}, (err, result)=>{
        if(err){
             //si erreur, retourne erreur `HTTP` 409 : CONFLICT
            console.log(err);
            console.log("erreur");
            res.status(409);
            res.end();
        }
        else
        {
            console.log("success");
            //sinon, l'_utilisateur_ a été trouvé, alors on genere un tableau avec les participants
        
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
            
            //On instancie un nouveau _projet_ à partir du _modèle_ avec son nom, le nom du créateur et les participants
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
            
            // On sauvegarde le _projet_
            project.save((err) => {
                if (err) 
                { 
                   //si erreur, retourne erreur `HTTP` 409 : CONFLICT
                    res.status(409);
                    console.log("erreur");
                    console.log(err);
                    res.end();
                }
                else
                {
                    //sinon, on retourne `HTTP` 200 : OK
                    res.status(200);
                    console.log('Projet Ajouté dans mongoDB !');
                    //console.log(project);
                    res.end();
                }
            });
        }
    });
});

// Méthode `GET` recupère le _projet_ grâce au _nom_ du propriétaire de celui-ci
router.get("/:name", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/get (all by user (owner) name)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    // On récupère le 1er paramètre de l'`URL`, le _pseudo_ du propriétaire
    let pseudo = req.url.split("/")[1];
    
    // On cherche le _projet_ en question
    projectModel.find({creatorName:pseudo}, (err, result) => {
        // S'il n'y a pas d'erreur, on retourne un `HTTP` 200 : OK avec le resultat
        if(err) console.log("erreur dans le get all");
        res.status(200);
        res.json(result);
        res.end();
    });
});

// Méthode `GET` recupère le(s) _projet(s)_ dont un des utilisateurs affectés a le _nom_ fournit en _paramètre_
router.get("/shared/:name", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/get (all project shared by user name)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    // On récupère le 2ème (/shared/..) paramètre de l'`URL`, le _pseudo_ en question
    let lePseudo = req.url.split("/")[2];
    
    // On recherche l'utilisateur qui a ce pseudo
    projectModel.find({'users.pseudo' : lePseudo}, (err, result) => {
        if(err)
        {
            //si erreur, retourne erreur `HTTP` 409 : CONFLICT
            console.log("erreur dans le get all");
            res.status(409);
            res.end();
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

router.get("/read", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/get (all project in read access)");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
});




// Méthode `DELETE` supprime le projet par son _id_ 
router.delete("/", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/delete");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    // on supprime le projet dans la base qui a l'_id_ passé dans le corps de la requête
    projectModel.remove({_id:req.body.id}, (err) => {
        if(err){
            //si erreur, retourne erreur `HTTP` 409 : CONFLICT
            console.log("erreur dans la suppression");
            res.status(409);
            res.end();
        }
        else
        {
            //sinon, on retourne `HTTP` 200 : OK
            console.log("Projet supprimé");
            res.status(200);
            res.end();
        }
    })
});

// Méthode `PUT` permet de mettre à jour la _description_ d'un projet par id
router.put("/description", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/updateDescription");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    // on cherche le projet dans la base qui a l'_id_ passé dans le corps de la requête
    projectModel.findOne({_id:req.body.id}, (err, project) => {
        if(err)
        {
              //si on ne trouve pas, retourne erreur `HTTP` 409 : CONFLICT
            console.log("erreur");
            res.status(409);
            res.end();
        }
        else
        {
            // la description est passée dans le corps de la requête
            project.description = req.body.description;
          
            // on sauvegarde le projet en question
            project.save((err, updatedProject) => {
            if (err){
                //si erreur, retourne erreur `HTTP` 409 : CONFLICT
                console.log("Erreur");
                console.log(err);
                res.status(409);
                res.end();
            }
            else
            {
                //sinon, on retourne `HTTP` 200 : OK
                console.log("Projet modifié dans la base");
                res.status(200);
                res.end();
            }
          });
          
        }
    });
});


// Méthode `PUT` permet de mettre à jour les jours _off_ d'un projet par _id_
router.put("/daysoff", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/updateDaysOff");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    // on cherche le projet dans la base qui a l'_id_ passé dans le corps de la requête
    projectModel.findOne({_id:req.body.id}, (err, project) => {
        if(err)
        {
            //si on ne trouve pas, retourne erreur `HTTP` 409 : CONFLICT
            console.log("erreur");
            res.status(409);
            res.end();
        }
        else
        {
            // les jours off sont passés dans le corps de la requête
            project.daysOff = req.body.daysOff;
          
          // on sauvegarde le projet en question
            project.save((err, updatedProject) => {
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
                console.log("Projet modifié dans la base");
                res.status(200);
                res.end();
            }
          });
          
        }
    });
});

// Méthode `PUT` permet de mettre à jour les ressources d'un projet par _id_
router.put("/resources", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/updateResources");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    // on cherche le projet dans la base qui a l'_id_ passé dans le corps de la requête
    projectModel.findOne({_id:req.body.id}, (err, project) => {
        if(err)
        {
            //si on ne trouve pas, retourne erreur `HTTP` 409 : CONFLICT
            console.log("erreur");
            res.status(409);
            res.end();
        }
        else
        {
           
            // les ressources sont passées dans le corps de la requête
            project.resources = req.body.resources;
          
          // on sauvegarde le projet en question
            project.save((err, updatedProject) => {
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
                console.log("Projet modifié dans la base");
                res.status(200);
                res.end();
            }
          });
          
        }
    });
});

// Méthode `PUT` permet de mettre à jour le milestone d'un projet par _id_
router.put("/milestone", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/updateMileStone");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    // on cherche le projet dans la base qui a l'_id_ passé dans le corps de la requête
    projectModel.findOne({_id:req.body.id}, (err, project) => {
        if(err)
        {
            //si on ne trouve pas, retourne erreur `HTTP` 409 : CONFLICT
            console.log("erreur");
            res.status(409);
            res.end();
        }
        else
        {
            
           // le milestone est passé dans le corps de la requête
            project.mileStone = req.body.milestone;

            // on sauvegarde le projet en question
            project.save((err, updatedProject) => {
            if (err){
                console.log("Erreur");
                console.log(err);
                //si erreur, retourne erreur `HTTP` 409 : CONFLICT
                res.status(409);
                res.end();
            }
            else
            {
                console.log("Projet modifié dans la base");
                //sinon, on retourne `HTTP` 200 : OK
                res.status(200);
                res.end();
            }
          });
          
        }
    });
});

// Méthode `PUT` permet de mettre à jour les taches d'un projet par _id_
router.put("/tasks", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/updateTasks");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    // on cherche le projet dans la base qui a l'_id_ passé dans le corps de la requête
    projectModel.findOne({_id:req.body.id}, (err, project) => {
        if(err)
        {
            //si on ne trouve pas, retourne erreur `HTTP` 409 : CONFLICT
            console.log("erreur");
            res.status(409);
            res.end();
        }
        else
        {
            // les taches sont passées dans le corps de la requête
            project.tasks = req.body.tasks;

            // on sauvegarde le projet en question
            project.save((err, updatedProject) => {
            if (err){
                console.log("Erreur");
                console.log(err);
                //si erreur, retourne erreur `HTTP` 409 : CONFLICT
                res.status(409);
                res.end();
            }
            else
            {
                console.log("Projet modifié dans la base");
                //sinon, on retourne `HTTP` 200 : OK
                res.status(200);
                console.log(updatedProject);
                res.end();
            }
          });
          
        }
    });
});

// Méthode `PUT` permet de mettre à jour le groupe de tache d'un projet par _id_
router.put("/grouptasks", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/updateGroupTasks");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
    // on cherche le projet dans la base qui a l'_id_ passé dans le corps de la requête
    projectModel.findOne({_id:req.body.id}, (err, project) => {
        if(err)
        {
            //si on ne trouve pas, retourne erreur `HTTP` 409 : CONFLICT
            console.log("erreur");
            res.status(409);
            res.end();
        }
        else
        {
            // le groupe de tache passées dans le corps de la requête
            project.groupTasks = req.body.groupTasks;

            // on sauvegarde le projet en question
            project.save((err, updatedProject) => {
            if (err){
                console.log("Erreur");
                console.log(err);
                //si erreur, retourne erreur `HTTP` 409 : CONFLICT
                res.status(409);
                res.end();
            }
            else
            {
                console.log("Projet modifié dans la base");
                res.status(200);
                //sinon, on retourne `HTTP` 200 : OK
                sendUpdate(req.body.nameOfService);
                res.end();
            }
          });
          
        }
    });
});

// Méthode `PUT` permet de mettre à jour les utilisateurs d'un projet par _id_
router.put("/users", (req, res) => {
    console.log("-->-->-->-->-->-->-->-->-->--");
    console.log("project/updateUsers");
    console.log("-->-->-->-->-->-->-->-->-->--");
    
     // on cherche le projet dans la base qui a l'_id_ passé dans le corps de la requête
    projectModel.findOne({_id:req.body.id}, (err, project) => {
        if(err)
        {
            //si on ne le trouve pas, retourne erreur `HTTP` 409 : CONFLICT
            console.log("erreur");
            res.status(409);
            res.end();
        }
        else
        {
            // si l'éditeur est égale au créateur
            if(req.body.editorName === project.creatorName)
            {
                // les utilisateurs sont passés dans le corps de la requête
                project.users = req.body.users;

                // on sauvegarde le projet en question
                project.save((err, updatedProject) => {
                    if (err){
                        console.log("Erreur");
                        console.log(err);
                        //si erreur, retourne erreur `HTTP` 409 : CONFLICT
                        res.status(409);
                        res.end();
                    }
                    else
                    {
                        console.log("Projet modifié dans la base");
                        res.status(200);
                        //sinon, on retourne `HTTP` 200 : OK en envoyant le notif d'update
                        sendUpdate(req.body.nameOfService);
                        res.end();
                    }
                });
            }
            else
            {
                console.log("Erreur");
                console.log(err);
                //si erreur, retourne erreur `HTTP` 401 : NON AUTHORIZED
                res.status(401);
                res.end();
            }
        }
    });
});

// **fonction** sendUpdate, permet d'envoyer la notification d'un service
function sendUpdate(nameOfService)
{
    // on récupere tous les projets
    projectModel.find({}, (err, result)=>{
        
        //on créé un service avec le nom et un ensemble de projet
        let service = new serviceModel({
            nameService:nameOfService,
            projects:result
        });
        
        //on envoi le service via socket attaché à l'évènement sendUpdate
        client.emit('sendUpdate', JSON.stringify(service));
    });
}


module.exports = router;