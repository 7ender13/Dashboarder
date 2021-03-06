'use strict';

const http          = require('http');
const path          = require('path');
const mongoose      = require('mongoose');
const express       = require('express');
const bodyParser    = require('body-parser');
const socketio      = require('socket.io');
const router        = express();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

let server = http.createServer(router);

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


router.use(express.static(path.join(__dirname, 'client_old/')));

const userCtrl    = require("./controller/userController");
const chatCtrl    = require("./controller/chatController");
const projectCtrl = require("./controller/projectController");
const todoCtrl = require("./controller/todoController");
const todoCtrl = require("./controller/todoController");
const serviceCtrl = require("./controller/serviceController");

router.use('/user', userCtrl);
router.use('/chat', chatCtrl);
router.use('/project', projectCtrl);
router.use('/todo', todoCtrl);
router.use('/service', serviceCtrl);


server.listen(3000, 'localhost', function(){
  console.log("-----------------------------------");
  console.log("Serveur en écoute sur le port " + 3000);
  console.log("-----------------------------------");
});

let io = socketio.listen(server);

io.on('connection', function(socket){
    console.log("client : "+socket.request.connection.remoteAddress+' connected');
    socket.join(0);
    /*MESSAGE PART*/
    socket.on('goToRoom', function(data){
        socket.join(data.projectID);
        socket.room = data.projectID;
        console.log('go to room : '+data.projectID)

        //init client message
        var conversation = {
            'participant' : [{'username' : 'Niko', 'status' : true}, {'username' : 'Yann Guineau', 'status' : false}],
            'messages' : [
                {'from' : 'Thomas Burgio', 'message' : 'nouveau message'},
                {'from' : 'Yann', 'message' : 'hello'},
                {'from' : 'Cyril Potdevin', 'message' : 'Salut'},
                {'from' : 'Thomas Burgio', 'message' : 'hello'},
                {'from' : 'Thomas Burgio', 'message' : 'hello'}
            ]
        };
        socket.emit('initMessage', conversation);
    })

    socket.on('newMessage', function(data){
        //save to BDD
        console.log(data);
        var messageObj = {'from' : data.from, 'message' : data.message}
        io.sockets.in(socket.room).emit('messageReceive',messageObj);
    });
})
