(function ()
{
    'use strict';

    angular
        .module('app.pages.projet')
        .controller('ProjetController', ProjetController);

    /** @ngInject */
    function ProjetController($scope, mySocket)
    {
        var vm = this;

        $scope.changeToRoom = function(projectID){
            mySocket.emit('goToRoom', {'projectID' : projectID});
        }

    }

})();
