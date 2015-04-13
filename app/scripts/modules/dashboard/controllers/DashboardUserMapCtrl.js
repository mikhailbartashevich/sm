define([
    
        'angular',


    ], function(angular) {
    'use strict';

    function DashboardUserMapController($scope, uiGmapGoogleMapApi) {

        var controller = this;

        this.clusterCalculator = function(markers, numStyles) {

            var markerInstances = markers.values(),
                markerLength = 0,
                stressLevelSum = 0;
                
                
            angular.forEach(markerInstances, function(markerInstance, index) {
                stressLevelSum += markerInstance.model.averageStressLevel;
                markerLength++;
                
                angular.forEach(markerInstance.stressMarkers, function(stressMarker, index) {
                    stressLevelSum += stressMarker;
                    markerLength++;
                });

            });

            var title = "Average stress level in this area. Detected : " + markerLength + " stress changes.";
            var count = Math.round(stressLevelSum / markerLength);

            var customIconsMap = {
                1 : 1, // blue
                2 : 1, // blue
                3 : 1, // blue
                4 : 2, // yellow
                5 : 3  // red
            };

            return {
                text: count,
                index: customIconsMap[count],
                title: title
            };

        };

        $scope.map = { 
            center:  {   
                latitude: 53.88954020000001, 
                longitude: 27.649613300000055 
            },
            options : {
                scrollwheel: false
            },
            zoom: 12, 
            control : {} 
        };

        $scope.clusterOptions = {
            calculator : controller.clusterCalculator
        };

        uiGmapGoogleMapApi.then(function(maps) {});

        $scope.stressMarkers = [];
        $scope.locations = [];

        $scope.setMapMarkers = function(points) {
            if(points && points.length) {
                $scope.stressMarkers = $scope.initMarkers(points);
            }
        };

        $scope.highLightTimelinePoint = function(id, geolocation) {
            console.log(geolocation);
        };

        function calculateAverageStressLevel(stressMarkers) {
            var summ = 0;

            angular.forEach(stressMarkers, function(stress) {
                summ += stress;
            });

            return Math.round(summ / stressMarkers.length);
        }

        $scope.initMarkers = function(points) {

            var markers = $scope.stressMarkers;

            angular.forEach(points, function(point, index) {

                if(point.locations) {
                    $scope.addLocationsToMap(point);
                }

                //remove duplicates
                var newMarker = true;

                angular.forEach(markers, function(marker, index) {

                    if(marker.geolocation.latitude === point.geolocation.latitude &&
                        marker.geolocation.longitude === point.geolocation.longitude) {
                        newMarker = false;
                        marker.stressMarkers.push(point.stressLevel);
                        // marker.averageStressLevel = calculateAverageStressLevel(marker.stressMarkers, marker);
                        calculateCustomIcon(marker);
                        return false;
                    }

                });

                if(newMarker) {
                    $scope.createNewMarker(markers, point);
                }


            });

            return markers;

        };


        $scope.addNewLocation = function(location) {

            location.coords = {
                longitude : location.geometry.location.lng,
                latitude : location.geometry.location.lat
            };

            location.vicinity = location.vicinity ? location.vicinity : 'Unnamed vicinity';

            location.name = '<div  class ="window-item"> Vicinity: ' + location.vicinity + '</div>' +
                            '<div  class ="window-item">' + location.name + '</div>';

            location.customIcon = 'http://maps.google.com/mapfiles/kml/pal5/icon13.png';

            location.show = false;
            
            location.onClick = function() {
                location.show = !location.show;
            };

            $scope.locations.push(location);

        };

        $scope.addLocationsToMap = function(point) {

            angular.forEach(point.locations, function(location, index) {

                var newLocation = true;

                if(location.types) {

                    angular.forEach(location.types, function(googleLocationType, index) {

                        if(googleLocationType === "colloquial_area") {
                            newLocation = false;
                            return false;
                        }

                    });

                    if(newLocation) {
                        angular.forEach($scope.locations, function(storedLocation, index) {

                            if(storedLocation.geometry.location.lat === location.geometry.location.lat && 
                                storedLocation.geometry.location.lng === location.geometry.location.lng) {

                                newLocation = false;

                                if(storedLocation.name.indexOf(location.name) === -1) {
                                    storedLocation.markerOptions.zIndex = storedLocation.markerOptions.zIndex ? storedLocation.markerOptions.zIndex + 1 : 1;
                                    storedLocation.name = storedLocation.name + '<div class="window-item">' + location.name + '</div>';
                                }
                                
                                return false;
                            } 

                        });
                    }

                    if(newLocation) {

                        location.markerOptions = {
                            draggable : false,
                            zIndex : 1
                        };

                        $scope.addNewLocation(location);
                    }

                }
               
            });
        };

        var levelMap = {
            1 : 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=1|21a9e1|ffffff',
            2 : 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=2|1988b6|ffffff',
            3 : 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=3|00a651|ffffff',
            4 : 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=4|fad839|000000',
            5 : 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=5|cc2424|ffffff'
        };

        function calculateCustomIcon(point) {

            if(point.travelType === 'car' && point.carEvent) {

                if(point.carEvent === 'Heavy braking') {

                    point.customIcon = '/images/stop.png';

                } else if(point.carEvent === 'Accelerate') {

                    point.customIcon =  '/images/acs.png';

                } else {

                    point.customIcon = 'http://maps.google.com/mapfiles/kml/pal2/icon39.png';

                }

                if(!point.marker) {
                    point.marker = {};
                }

                point.marker.icon = point.customIcon;
                
            } else {
                point.customIcon = levelMap[point.stressLevel];
            }
        }

        $scope.createNewMarker = function(markers, point) {
            point.show = false;
            point.stressMarkers = [point.stressLevel];
            point.averageStressLevel = point.stressLevel;
            
            point.onClick = function() {
                point.show = !point.show;
            };

            if(point.marker && point.marker.description) {

                point.title = '<div >';

                if(point.marker.time) {
                    point.title +='<div class ="window-item">' + point.marker.time.time + ' ' + point.marker.time.date + '</div>';
                }
                if(point.weather.weatherIconUrl[0].value) {
                    point.title +='<img src="' + point.weather.weatherIconUrl[0].value + '">';
                }
                if(point.weather && point.weather.tempF) {

                    point.title +='<div class ="window-item">' + point.weather.tempF + '°F, ' + point.weather.pressure + 'mb, ' + point.weather.humidity + '%</div> ';

                } 
                
                point.title += '<div class ="window-item">' + point.marker.description + '</div></div>';

            }

            calculateCustomIcon(point);

            markers.push(point);            
        };

        $scope.calculateNextMarkers = function(points) {
            if(points && points.length) {
                $scope.stressMarkers = $scope.initMarkers(points);
            }
        };

        //todo find old marker and replace
        $scope.addNewMarker = function(point) {
            $scope.createNewMarker($scope.stressMarkers, point);
        };

    }

    return  DashboardUserMapController;
});