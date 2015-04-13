define([
    'angular', 
    'bootstrap',
    'modules/dashboard/controllers/DashboardUserMapCtrl'

    ], function(angular) {
    'use strict';

    function LoginController($scope,  $controller, $http, $rootScope, $state, ApiService) {

        $scope.skipInitRequest = true;

        var dashboardUserMapCtrl = $controller('DashboardUserMapCtrl', {$scope: $scope});

        $scope.map = { 
            center:  {   
                latitude: 53, 
                longitude: 27 
            },
            options : {
                scrollwheel: false
            },
            zoom: 4, 
            control : {} 
        };

        $scope.clusterOptions = {

            calculator : dashboardUserMapCtrl.clusterCalculator

        };

        $http.get('/api/point/byperiod?period=lastyear&userid=all&light=true').success(function(response) {
            $scope.setMapMarkers(response.points);                
        });
        
        $scope.handleLoginBtnClick = function() {
            ApiService.login($scope.loginForm)
                .then(function(response) {
                    initUser(response.data);
                })
                .catch(function(resp) {
                    $scope.errorMessage = 'Invalid credentials';
                });
        };

        $scope.handleDemoLoginBtnClick = function() {
            $rootScope.user.role = 'admin';
            $state.go('dashboard.main');
        };

        $scope.loginWithVendor = function(vendor) {
            ApiService.loginWithVendor(vendor) 
                .then(function(response) {
                    initUser(response.data);
                })
                .catch(function(resp) { 
                    $scope.errorMessage = 'Invalid credentials, login via vendor ' + vendor + ' failed';
                });
        };

        $scope.signUp = function() {
            ApiService.signUp($scope.registrationForm)
               .then(function(response) {
                    initUser(response.data);
                })
                .catch(function(resp) { 
                    if(resp.data.message.errors) {

                        if(resp.data.message.errors.email) {
                            $scope.errorMessage = resp.data.message.errors.email.message;
                        }

                        if(resp.data.message.errors.password) {
                            $scope.errorMessage = resp.data.message.errors.password.message;
                        }
                    }
                    
                });
        };

        function initUser(data) {
            
            if(data) {
                $rootScope.user.role = 'admin';
            }

            $state.go('dashboard.main');
        }

    }

    return  LoginController;
});