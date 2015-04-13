define([
        'angular', 
        'config', 
        'modules/common/adminlte/directives/initAppDirective',
        // 'modules/common/adminlte/directives/chartJSDirective',
        // 'modules/common/adminlte/directives/timelineDirective'

    ], 

    function (angular, ApplicationConfiguration, initAppDirective, chartJSDirective, timelineDirective) {

        'use strict';

        var adminLTEModule = ApplicationConfiguration.registerModule('adminLTEModule');


        adminLTEModule.directive('initAdminLteLayout', initAppDirective);
        // adminLTEModule.directive('chartJs', chartJSDirective);
        return adminLTEModule;
    });
