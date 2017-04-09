'use strict';

const http          = require('http');
const path          = require('path');
const mongoose      = require('mongoose');

const express         = require('express');
const bodyParser      = require('body-parser');
const router        = express();
const server          = http.createServer(router);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const userCtrl      = require("./controller/userController");
const chatCtrl      = require("./controller/chatController");
const projectCtrl      = require("./controller/projectController");

//MongoDB : Collection "DashBoard" créé pour le projet
mongoose.connect('mongodb://localhost/DashBoard', (error)=> {
    if(error)
    {
        console.log("Connection database : NOK !");
        console.log(error)
    }
    else
    {
        console.log("Connection database : OK !");
    }
});

router.use(express.static(path.join(__dirname, 'client_old')));
router.use('/user', userCtrl);
router.use('/chat', chatCtrl);
router.use('/project', projectCtrl);


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("-----------------------------------");
  console.log("Serveur en écoute sur le port " + process.env.PORT);
  console.log("-----------------------------------");
});

