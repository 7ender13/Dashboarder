(function ()
{
    'use strict';

    angular
        .module('app.pages.projet')
        .controller('ProjetController', ProjetController);

    /** @ngInject */
    function ProjetController($scope, mySocket, $mdDialog, $http)
    {
        var vm = this;

        $scope.changeToRoom = function(projectID){
            mySocket.emit('goToRoom', {'projectID' : projectID});
        }

        $scope.create = function(name, desc, chips){


            console.log(name, desc, chips);
            var projet = {
            	'name':name,
            	'description':desc,
            	/*'partipants':[{id:''},{id:''}]*/
            }
        }

        // Methods
        $scope.showPrompt = function(ev) {
            $mdDialog.show({
                templateUrl: 'app/main/pages/projet/new-project.popup.html',
                controller: ProjetController,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: true // Only for -xs, -sm breakpoints.
            });
        };

        /*CHIPS MODULE*/
        var self = this;
        var pendingSearch, cancelSearch = angular.noop;
        var cachedQuery, lastSearch;
        self.allContacts = loadContacts();
        console.log(self.allContacts);
        //members of the project
        self.contacts = [self.allContacts[0]];
        self.contacts = [];
        self.asyncContacts = [];
        self.filterSelected = true;
        self.querySearch = querySearch;
        self.delayedQuerySearch = delayedQuerySearch;

        /**
         * Search for contacts; use a random delay to simulate a remote call
         */
        function querySearch (criteria) {
          return self.allContacts.filter(createFilterFor(criteria));
        }
        /**
         * Async search for contacts
         * Also debounce the queries; since the md-contact-chips does not support this
         */
        function delayedQuerySearch(criteria) {
          cachedQuery = criteria;
          if ( !pendingSearch || !debounceSearch() )  {
            cancelSearch();
            return pendingSearch = $q(function(resolve, reject) {
              // Simulate async search... (after debouncing)
              cancelSearch = reject;
              $timeout(function() {
                resolve( self.querySearch() );
                refreshDebounce();
              }, Math.random() * 500, true)
            });
          }
          return pendingSearch;
        }
        function refreshDebounce() {
          lastSearch = 0;
          pendingSearch = null;
          cancelSearch = angular.noop;
        }
        /**
         * Debounce if querying faster than 300ms
         */
        function debounceSearch() {
          var now = new Date().getMilliseconds();
          lastSearch = lastSearch || now;
          return ((now - lastSearch) < 300);
        }
        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
          var lowercaseQuery = angular.lowercase(query);
          return function filterFn(contact) {
            return (contact._lowername.indexOf(lowercaseQuery) != -1);
          };
        }
        function loadContacts() {
            /*$http({
              method: 'GET',
              url: 'http://dashboarder-duff013.c9users.io/user'
            }).then(function successCallback(response) {
                console.log(response);
            }, function errorCallback(response) {
                console.log(response);
            });*/
          var contacts = [
          {
            "_id": "58e62ce2d4204f5e4ceb6d83",
            "name": "aaa",
            "surname": "bbb",
            "pseudo": "duff",
            "password": "azerty",
            "email": "nicolas.dufour@ynov.com",
            "__v": 0,
            "projects": [

            ]
          },
          {
            "_id": "58e63291d4204f5e4ceb6d86",
            "name": "aaa",
            "surname": "bbb",
            "pseudo": "still",
            "password": "azerty",
            "email": "large",
            "__v": 0,
            "projects": [

            ]
          },
          {
            "_id": "58e635a8d4204f5e4ceb6d88",
            "name": "aaa",
            "surname": "bbb",
            "pseudo": "test",
            "password": "azerty",
            "email": "large",
            "__v": 0,
            "projects": [

            ]
          },
          {
            "_id": "58e638eb7b61626bc5bd42f0",
            "name": "aaa",
            "surname": "bbb",
            "pseudo": "te3st",
            "password": "azerty",
            "email": "test email",
            "__v": 0,
            "projects": [

            ]
          },
          {
            "_id": "58e63ac07b61626bc5bd42f4",
            "name": "aaa",
            "surname": "bbb",
            "pseudo": "te3sat",
            "password": "azerty",
            "email": "tibo.t@ynov.com",
            "__v": 0,
            "projects": [

            ]
          },
          {
            "_id": "58e65c64c1e1ccd10ef68663",
            "name": "aaa",
            "surname": "bbb",
            "pseudo": "eaaze",
            "password": "azerty",
            "email": "tibo.t@ynov.com",
            "__v": 0,
            "projects": [

            ]
          }
        ];
          return contacts.map(function (c, index) {
            var cParts = [c.name, c.surname];
            var contact = {
                id : c['_id'],
                name: c.name+' '+c.surname,
                email: c.email,
                image: 'http://lorempixel.com/50/50/people?' + index
            };
            contact._lowername = contact.name.toLowerCase();

            return contact;
          });
        }
    }
})();
