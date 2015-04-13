if(typeof module === 'undefined') {
    module = {};
}

module.exports = function() {


    return {
        paths: {
            'jquery'                : '../../bower_components/jquery/dist/jquery',
            'angular'               : '../../bower_components/angular/angular',
            'angular-ui-router'     : '../../bower_components/angular-ui-router/release/angular-ui-router',
            'angular-resource'      : '../../bower_components/angular-resource/angular-resource',
            'angular-animate'       : '../../bower_components/angular-animate/angular-animate',
            'angular-cookies'       : '../../bower_components/angular-cookies/angular-cookies',
            'satellizer'            : '../../bower_components/satellizer/satellizer',
            'angular-permission'    : '../../bower_components/angular-permission/dist/angular-permission',
            'bootstrap'             : '../../bower_components/adminlte/bootstrap/js/bootstrap',
            'adminlte'              : '../../bower_components/adminlte/dist/js/app',
            'lodash'                : '../../bower_components/lodash/dist/lodash.compat',
            'ngInfiniteScroll'      : '../../bower_components/ngInfiniteScroll/build/ng-infinite-scroll',
            'angular-google-maps'   : '../../bower_components/angular-google-maps/dist/angular-google-maps',
            'ngSocket'              : '../../bower_components/ngSocket/dist/ngSocket',
            'templates'             : 'templates/templates'
        },

        shim: {

            'bootstrap':  {
                deps: ['jquery'],
                exports: 'bootstrap'
            },

            'angular':  {
                deps: ['jquery'],
                exports: 'angular'
            },

            'angular-ui-router' : {
                deps: ['angular']
            },

            'angular-permission': ['angular', 'angular-ui-router'],

            'angular-resource'  : ['angular'],
            
            'angular-animate'   : ['angular'],

            'angular-cookies' : {
                deps: ['angular']
            },

            'angular-google-maps' : {
                deps: ['lodash', 'angular']
            },

            'ngInfiniteScroll' : {
                deps: ['angular']
            },

            'ngSocket' : {
                deps : ['angular']
            },

            'satellizer' : {
                deps: ['angular', 'angular-cookies']
            },

            'adminlte' : {
                deps: ['jquery', 'bootstrap']
            },

            'templates' : {
                deps: ['angular']
            }
        }
    };

};


    