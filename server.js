'use strict';

const http          = require('http');
const path          = require('path');
const mongoose      = require('mongoose');

let express         = require('express');
let bodyParser      = require('body-parser');
const router        = express();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
let server          = http.createServer(router);

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

router.use(express.static(path.join(__dirname, 'client/dist')));
router.use('/user', userCtrl);
router.use('/chat', chatCtrl);
router.use('/project', projectCtrl);


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("-----------------------------------");
  console.log("Serveur en écoute sur le port " + process.env.PORT);
  console.log("-----------------------------------");
});

