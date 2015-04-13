define([
    
        'angular'

    ], function(angular) {
    'use strict';

    function DashboardUserTimelineController($scope, $rootScope, $http) {

        $scope.timelineEvents = [];        

        $scope.busy = false;

        var controller = this;

        $scope.setTimelinePoints = function(points) {
            $scope.timelineEvents = points;
        };

        $scope.highLightMarker = function(id, geolocation) {
            var centerLatLng = new google.maps.LatLng(geolocation.latitude, geolocation.longitude);
            var gMap = $scope.map.control.getGMap();
            gMap.panTo(centerLatLng);
            gMap.setZoom(24);
            
            angular.forEach($scope.stressMarkers, function(marker) {
                marker.show = marker.id === id;
            });

            angular.forEach($scope.locations, function(location) {
                location.show = false;
            });
        };

        // add point on runtime
        $scope.addPointToTheTopOfTimeline = function(point) {
            if($scope.timelineEvents &&  $scope.timelineEvents.length) {

                var firstPoint = $scope.timelineEvents[0];

                if(firstPoint.stressLevel === point.stressLevel) {
                    var lastEvent = firstPoint.lastEvent,
                        previousEvents = firstPoint.previousEvents;

                    point.previousEvents = [lastEvent].concat(previousEvents);

                    $scope.timelineEvents[0] = point;

                } else {
                    $scope.timelineEvents.unshift(point);
                }

            } else {
                $scope.timelineEvents = [point];
            }
        };

        //merge points after infinite scroll performed
        $scope.reinitTimelinePoints = function(responsePoints) {

            var newPointsToDislay = [],
                lastItem = $scope.timelineEvents[$scope.timelineEvents.length - 1],
                stressLevel = lastItem.stressLevel,
                lastEvent = lastItem.lastEvent,
                point = responsePoints[0];

            if(stressLevel === point.stressLevel) {

                var previousEvents = [point.lastEvent].concat(point.previousEvents);
                lastItem = point;
                lastItem.previousEvents = previousEvents;
                
                newPointsToDislay = $scope.timelineEvents.concat(responsePoints.slice(1, responsePoints.length));
            } else {
                newPointsToDislay = $scope.timelineEvents.concat(responsePoints);
            }

            $scope.setTimelinePoints(newPointsToDislay);

            return newPointsToDislay;

        };

        $scope.calculateNextPoints = function(callback) {

            var pointsToDisplay = $scope.timelineEvents;

            if($scope.timelineEvents.length > 1 && !$scope.timeLineEnded) {

                var lastItemTimestamp = $scope.timelineEvents[$scope.timelineEvents.length - 1].timestamp;

                $scope.busy = true;

                $http.get('/api/point/byperiod?to=' + lastItemTimestamp + '&stress=' +  $scope.stressLevel +
                    '&userid=' + $rootScope.user.username).success(function(response) {
                        
                    $scope.busy = false;

                    if(response.points && response.points.length) {
                        pointsToDisplay = $scope.reinitTimelinePoints(response.points);
                        callback(pointsToDisplay);
                    }
                        
                    $scope.timeLineEnded = !response.points  || (response.points && response.points.length < 2);

                });

            } else if($scope.timeLineEnded) {
                //disable infinite scroll when there is no data
                $scope.busy = true;
            }

            return pointsToDisplay;

        };
       

    }

    return  DashboardUserTimelineController;
});