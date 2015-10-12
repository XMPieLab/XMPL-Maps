(function (angular) {
    'use strict';

    angular.module('xmp.app').service('xmpMapDirectionService', ['$log', 'xmpMapMarkersService', function ($log, xmpMapMarkersService) {
        var setRoute = function(map, r, customMarkers) {
                function resolveRoute(response, status){
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                    } else {
                        $log.error('Directions request failed due to ' + status);
                    }
                }

                function resolveRouteWithCustomMarkers(response, status){
                    var icons = {
                        start: new google.maps.MarkerImage(
                            customMarkers.start.url,
                            new google.maps.Size(customMarkers.start.size.width, customMarkers.start.size.height),
                            new google.maps.Point(customMarkers.start.origin.x, customMarkers.start.origin.y),
                            new google.maps.Point(customMarkers.start.anchor.x, customMarkers.start.anchor.y)
                        ),
                        end: new google.maps.MarkerImage(
                            customMarkers.end.url,
                            new google.maps.Size(customMarkers.end.size.width, customMarkers.end.size.height),
                            new google.maps.Point(customMarkers.end.origin.x, customMarkers.end.origin.y),
                            new google.maps.Point(customMarkers.end.anchor.x, customMarkers.end.anchor.y)
                        )
                    };

                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                        var leg = response.routes[0].legs[0];
                        xmpMapMarkersService.createMarker(map, leg.start_location, icons.start);
                        xmpMapMarkersService.createMarker(map, leg.end_location, icons.end);
                    }
                }

                var renderOptions = {
                        polylineOptions : r.color ? { polylineOptions: { strokeColor: r.color }} :undefined,
                        suppressMarkers : customMarkers ? true : undefined
                    },
                    directionsService = new google.maps.DirectionsService(),
                    directionsDisplay = new google.maps.DirectionsRenderer(renderOptions);


                directionsDisplay.setMap(map);
                directionsService.route({
                    origin: r.origin,
                    destination: r.destination,
                    travelMode: google.maps.TravelMode.DRIVING
                }, customMarkers ? resolveRouteWithCustomMarkers : resolveRoute);


            };



        return {
            setRoute: setRoute

        }

    }]);
}(angular));