define([
    
        'angular',
        'modules/dashboard/controllers/DashboardUserMapCtrl',
        'modules/dashboard/controllers/DashboardUserTimelineCtrl'


    ], function(angular) {

    'use strict';

    function DashboardMainController($scope, $controller, $rootScope, $http, ngSocket) {

        var dashboardUserMapCtrl = $controller('DashboardUserMapCtrl', {$scope: $scope}),
            dashboardUserTimelineCtrl = $controller('DashboardUserTimelineCtrl', {$scope: $scope});

        $scope.stressLevel = 'all';
        $scope.period = 'lastday';
  
        var controller = this;

        $scope.applyFilter  = function(period, stressLevel) {

            $scope.period = period ? period : $scope.period;
            $scope.stressLevel = stressLevel ? stressLevel : $scope.stressLevel;

            $http.get('/api/point/byperiod?period=' + $scope.period + '&stress=' +  $scope.stressLevel + '&userid=' + $rootScope.user.username).success(function(response) {
                $scope.setTimelinePoints(response.points);
                $scope.stressMarkers = [];
                $scope.stressMarkers = $scope.initMarkers($scope.timelineEvents);                
            });

        };

        this.startListeningSocket = function() {
            var ws = ngSocket('ws://108.59.83.65:3000/');

            ws.send({username: $rootScope.user.username});

            ws.onMessage(function(message) {
                var pointObject = $.parseJSON(message.data);

                if(pointObject.stressLevel) {
                    $scope.addPointToTheTopOfTimeline(pointObject);
                    $scope.stressMarkers = [];
                    $scope.stressMarkers = $scope.initMarkers($scope.timelineEvents);  
                }

            });
        };

        $scope.timelineNextPage = function() {
            $scope.calculateNextPoints(function(pointsToDisplay) {
                $scope.initMarkers(pointsToDisplay);
            });
        };
        
        if(!$scope.skipInitRequest) {
            $http.get('/api/userinfo').success(function(response) {

                if(response.user) {
                    $rootScope.user = response.user;
                    $rootScope.user.role = 'admin';
                }

                if(!$rootScope.user.username) {
                    $rootScope.user.providerData = { 
                        name : 'Test user'
                    };
                    
                    $rootScope.user.username = 'ogievichdv';
                }

                if($rootScope.user.username.indexOf('@') !== -1) {
                    $rootScope.user.username = $rootScope.user.username.substr(0, str.indexOf('@'));
                }

                $http.get('/api/point/byperiod?period=lastday&userid=' + $rootScope.user.username).success(function(response) {
                    $scope.setTimelinePoints(response.points);
                    $scope.setMapMarkers(response.points); 
                    controller.startListeningSocket();
                });

            });
        }

    }

    return  DashboardMainController;
});