define([
    'angular',
    'angular-cookies',
    'satellizer', 
    'angular-permission',
    'templates'
    ], 

    function (angular) {
        'use strict';

        // Init module configuration options
        var applicationModuleName = 'appModule';

        var applicationModuleVendorDependencies = ['satellizer', 'ngCookies', 'permission', 'main.templates', ];

        var applicationModuleCustomDependencies = [];

        // Add a new vertical module
        var registerModule = function(moduleName, dependencies) {
            applicationModuleCustomDependencies.push(moduleName);
            return angular.module(moduleName, dependencies || []);
        };

        var collectAllDependencies = function() {
            return applicationModuleVendorDependencies.concat(applicationModuleCustomDependencies);
        };

        return {

                applicationModuleName: applicationModuleName,
                collectAllDependencies: collectAllDependencies,
                registerModule: registerModule

            };
    });