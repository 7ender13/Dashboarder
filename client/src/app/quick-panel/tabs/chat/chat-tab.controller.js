(function ()
{
    'use strict';

    angular
        .module('app.quick-panel')
        .controller('ChatTabController', ChatTabController);

    /** @ngInject */
    function ChatTabController(msApi, $timeout, $scope, mySocket, $mdDialog)
    {
        var vm = this;

        $scope.mySelf = "Cyril Potdevin";
        vm.conversation = {};

        mySocket.on('initMessage', function(conversation){
            vm.conversation = conversation;
            console.log(conversation)
        });

        $scope.sendMessage = function(message){
            mySocket.emit('newMessage', {'from': $scope.mySelf, 'message' : message});
            message = '';
        }

        mySocket.on('messageReceive', function(data){
            console.log(data);
            vm.conversation.messages.push(data);
        })
    }

})();
