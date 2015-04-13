define([
    
    'angular',
    'config',
    'services/UserService',
    'services/MenuService',
    'services/ApiService',
    'modules/login/loginModule',
    'modules/common/adminlte/adminLTEModule',
    'modules/dashboard/dashboardModule'
    
    ], 

    function (angular, ApplicationConfiguration, UserService, MenuService, ApiService) {

        'use strict';

        var app = angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.collectAllDependencies());

        app.config(function ($locationProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
        });

        app.config(function(uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                //    key: 'your api key',
                v: '3.17',
                libraries: 'weather, geometry, visualization'
            });
        });

        app.factory('ApiService', ApiService);
        app.factory('UserService', UserService);
        app.factory('MenuService', MenuService);

        app.run(function($rootScope, Permission, UserService) {
            $rootScope.user = {};
            $rootScope.user.role = UserService.roles.ANONYMOUS;
            UserService.defineRoles();
        });

        return app;
    });
