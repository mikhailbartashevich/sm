define([
    'angular', 
    'config'

], function(angular, appConfig) {

    function ApiService($auth, $http) {

        var service = new BackEndApiService();
        

        function BackEndApiService() {

        }

        BackEndApiService.prototype.addData = function(tableId, data) {
            throw new Error("Not implemented!");
        };

        BackEndApiService.prototype.retrieveData = function(url) {
            throw new Error("Not implemented!");
        };


        BackEndApiService.prototype.signUp = function(registrationForm) {
            
            registrationForm.username = registrationForm.email;

            return $http.post('/api/auth/signup', registrationForm);
        };

        BackEndApiService.prototype.loginWithVendor = function(vendor) {
            //returns promise
            return $http.get('/api/auth/' + vendor);
        };

        BackEndApiService.prototype.login = function(loginForm) {
            loginForm.username = loginForm.email;
            return $http.post('/api/auth/login', loginForm);
        };

        BackEndApiService.prototype.logout = function() {
            //returns promise
            return $http.get('/api/auth/signout');
        };

        return {

            login: function (loginForm) {
                return service.login(loginForm);
            },

            logout: function() {
                return service.logout();
            },

            loginWithVendor: function(vendor) {
                return service.loginWithVendor(vendor);
            },

            signUp: function(registrationForm) {
                return service.signUp(registrationForm);
            },

            addData: function(tableId, data) {
                return service.addData(tableId, data);
            },

            retrieveData : function(url, scope, field) {
                return service.retrieveData(url, scope, field);
            },

        };
    }


    return ApiService;
});