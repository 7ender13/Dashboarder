(function ()
{
    'use strict';

    angular
        .module('app.quick-panel', ['btford.socket-io'])
        .factory('mySocket', function (socketFactory) {
            return socketFactory({
                  ioSocket: io()
              });
        })
        .config(config);

    /** @ngInject */
    function config($translatePartialLoaderProvider, msApiProvider)
    {

        // Translation
        $translatePartialLoaderProvider.addPart('app/quick-panel');

        // Api
        msApiProvider.register('quickPanel.activities', ['app/data/quick-panel/activities.json']);
        msApiProvider.register('quickPanel.contacts', ['app/data/quick-panel/contacts.json']);
        msApiProvider.register('quickPanel.events', ['app/data/quick-panel/events.json']);
        msApiProvider.register('quickPanel.notes', ['app/data/quick-panel/notes.json']);
    }
})();
