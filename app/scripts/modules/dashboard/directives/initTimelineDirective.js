define([
    
        'angular'

    ], function(angular) {
    'use strict';

    function timelineDirective() {

        return {

            restrict: 'E',

            link: function ($scope, $elem, attrs) {

                $(document).ready(function($) {

                    $scope.$on('markerClicked', function(event, pointId) {

                        $('.timeline-body input[type="radio"]').prop('checked', false);
                        
                        var $timeline_block = $('#point-' + pointId);

                        $('.timeline-body').animate({
                            scrollTop: $timeline_block.position().top - 100
                        }, 2000);

                        $timeline_block.children('input[type="radio"]').prop('checked', true);

                    });
                   
                });

            }

        };
    }

    return  timelineDirective;
});