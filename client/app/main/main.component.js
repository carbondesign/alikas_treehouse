import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

import comicPanel from '../components/comicPanel/comicPanel.component';
import codeEditor from '../components/codeeditor/codeeditor.component';

export class MainController {

    /*@ngInject*/
    constructor($http, $scope, socket) {
        this.$http = $http;
        this.socket = socket;

        $scope.$on('$destroy', function() {
            socket.unsyncUpdates('thing');
        });
        $scope.isCollapsed = true;
        $scope.totalItems = 64;
        $scope.currentPage = 4;

    }

    $onInit() {
        this.$http.get('/api/things')
            .then(response => {
                this.awesomeThings = response.data;
                this.socket.syncUpdates('thing', this.awesomeThings);
            });
    }

    addThing() {
        if (this.newThing) {
            this.$http.post('/api/things', {
                name: this.newThing
            });
            this.newThing = '';
        }
    }

    deleteThing(thing) {
        this.$http.delete('/api/things/' + thing._id);
    }
}

export default angular.module('aliaApp.main', [uiRouter, comicPanel, codeEditor])
    .config(routing)
    .component('main', {
        template: require('./main.html'),
        controller: MainController
    })
    .name;
