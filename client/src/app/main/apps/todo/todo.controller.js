(function ()
{
    'use strict';

    angular
        .module('app.todo')
        .controller('TodoController', TodoController);

    /** @ngInject */
    function TodoController($scope)
    {
        //A model holding tasks
      $scope.taskList = [
        {
          done: false,
          task: 'Show some tasks'
        },
        {
          done: false,
          task: 'Add a task'
        },
        {
        done: false,
        task: 'Finish the project'
      }
      ];

    //Function for adding task to the task list
      $scope.addTask = function(task) {
        //I'm pushing a new task to the task list
        $scope.taskList.push({
          done: false,
          task: task
        });
      };

      $scope.deleteTask = function(id){
          $scope.taskList.splice(id, 1);
      }

    }
})();
