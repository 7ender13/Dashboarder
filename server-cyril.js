// help : https://scalegrid.io/blog/getting-started-with-mongodb-and-mongoose/
// https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications

// help2 : http://stackoverflow.com/questions/35680565/sending-message-to-specific-client-in-socket-io

// Test Socket.IO at http://amritb.github.io/socketio-client-tool/

var express = require('express');
var app = express();
var httpServer = require('http').createServer(app).listen('8000');
var io = require('socket.io').listen(httpServer);


console.log('Server started.');


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
