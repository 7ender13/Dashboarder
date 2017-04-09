(function ()
{
    'use strict';

    angular
        .module('app.todo',
            []
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.to-do', {
            url      : '/to-do',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/apps/todo/todo.html',
                    controller : 'TodoController as vm'
                }
            },
            bodyClass: 'todo'
        });


        // Navigation
        msNavigationServiceProvider.saveItem('apps.to-do', {
            title : 'To-Do',
            icon  : 'icon-checkbox-marked',
            state : 'app.to-do',
            weight: 9
        });
    }

})();
