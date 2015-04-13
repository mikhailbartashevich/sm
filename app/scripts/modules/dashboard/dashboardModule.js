define([
        'angular', 
        'config', 
        'modules/dashboard/controllers/DashboardCtrl', 
        'modules/dashboard/controllers/DashboardUserMapCtrl',
        'modules/dashboard/controllers/DashboardUserTimelineCtrl',
        'modules/dashboard/controllers/DashboardMainCtrl',
        // 'modules/dashboard/controllers/DashboardChartsCtrl',
        // 'modules/dashboard/controllers/DashboardTablesCtrl',
        'angular-google-maps',
        'ngInfiniteScroll',
        'ngSocket',
        'angular-ui-router',
        'adminlte'
    ], 

    function (angular, ApplicationConfiguration, DashboardCtrl, DashboardUserMapCtrl, DashboardUserTimelineCtrl, DashboardMainCtrl) {

        'use strict';

        var dashboardModule = ApplicationConfiguration.registerModule('dashboardModule', [
            'ui.router', 'uiGmapgoogle-maps', 'infinite-scroll', 'ngSocket']);

        dashboardModule.config(function ($stateProvider) {

            $stateProvider
                .state('dashboard', {
                    url: "/dashboard",
                    templateUrl: "scripts/modules/dashboard/templates/dashboard.html",
                    // data: {
                    //     permissions: {
                    //         only: ['admin']
                    //     }
                    // },
                    controller: 'DashboardCtrl'
                }).state('dashboard.main', {
                    url: "/main-dashboard",
                    templateUrl: "scripts/modules/dashboard/templates/mainDashboard.html",
                    // data: {
                    //     permissions: {
                    //         only: ['admin']
                    //     }
                    // },
                    controller: 'DashboardMainCtrl'
                });
        });

        dashboardModule.controller('DashboardCtrl', DashboardCtrl);
        dashboardModule.controller('DashboardUserMapCtrl', DashboardUserMapCtrl);
        dashboardModule.controller('DashboardUserTimelineCtrl', DashboardUserTimelineCtrl);
        dashboardModule.controller('DashboardMainCtrl', DashboardMainCtrl);
        // dashboardModule.controller('DashboardChartsCtrl', DashboardChartsCtrl);
        // dashboardModule.controller('DashboardTablesCtrl', DashboardTablesCtrl);

        return dashboardModule;
    });
