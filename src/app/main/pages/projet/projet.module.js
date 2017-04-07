(function ()
{
    'use strict';

    angular
        .module('app.pages.projet', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider.state('app.pages_projet', {
            url      : '/projet',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pages/projet/projet.html',
                    controller : 'ProjetController as vm'
                }
            },
            bodyClass: 'projet'
        });

        $stateProvider.state('app.pages_projet_get', {
            url      : '/projet/:id',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pages/projet/get/projet.html',
                    controller : 'ProjetController as vm'
                }
            },
            bodyClass: 'projet'
        });

        // Navigation
        /*msNavigationServiceProvider.saveItem('pages.profile', {
            title : 'Profile',
            icon  : 'icon-account',
            state : 'app.pages_profile',
            weight: 6
        });*/
    }

})();
