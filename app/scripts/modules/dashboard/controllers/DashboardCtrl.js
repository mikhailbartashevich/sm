define([
    
        'angular',


    ], function(angular) {
    'use strict';

    function DashboardController($scope, $rootScope, $state, $http, ApiService ) {

        if(!$scope.user) {
            $scope.user = {};
        }

        $scope.user.image = '/images/photo.jpg';

        $http.get('/api/userinfo').success(function(response) {

            if(response.user) {
                $rootScope.user = response.user;
                $rootScope.user.role = 'admin';
                $scope.user.image = $scope.user.providerData && $scope.user.providerData.picture ? 
                $scope.user.providerData.picture : '/images/darthvader.jpg';
            }
            
        });

        $scope.handleSignOutBtnClick = function() {

            $rootScope.user = {};

            $scope.user = {};

            $rootScope.user.role = 'anonymous';

            ApiService.logout();

            $state.go('login');
        };

    }

    return  DashboardController;
});