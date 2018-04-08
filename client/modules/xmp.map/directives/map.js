(function (angular) {
    'use strict';

    /**
     * Global callback function for the google map loaded.
     * @private
     */
    window.__google_api_loaded_for_xmp_map__ = function () {
        window.__google_api_xmp_map_loaded__ = true;
        var rootScope = angular.element(document.body).scope().$root;
        rootScope.$broadcast('map-api-ready');
    };

    /**
     * Loads the google maps JavaScript when DOM is ready
     */
    $(function(){
        $.getScript("https://maps.google.com/maps/api/js?callback=__google_api_loaded_for_xmp_map__")
            .fail(function (jqxhr) {
                console.log("XMP MAP - Could not load Google Map script: " + jqxhr);
            });
    });

    /**
     * Gets the computed style of a dom element.
     * @param el The element to get the value.
     * @param styleProp The style property to get the computed value for.
     * @returns {*} The computed style for the CSS property.
     */
    function getStyle(el, styleProp) {
        var y;
        if (el.currentStyle) {
            y = el.currentStyle[styleProp];
        } else if (window.getComputedStyle) {
            y = document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
        }
        return y;
    }

    /**
     * Sets the default display and height css on the map.
     * @param element The DOM element of the map.
     */
    function setDefaultMapSize(element) {
        if (getStyle(element[0], 'display') != 'block') {
            element.css('display', 'block');
        }
        if (getStyle(element[0], 'height').match(/^(0|auto)/)) {
            element.css('height', '300px');
        }
    }


    /**
     * Extends the source with the provided namespace if needed and sets the value of the ns child node.
     * @param source The source to be extends.
     * @param ns The namespace to be tested.
     * @param val The value to be set.
     */
    function extend(source, ns, val) {
        var nsParts = ns.split('.'),
            nsLastIndex = nsParts.length - 1,
            obj = source;

        nsParts.forEach(function (part, index) {
            if (index == nsLastIndex) {
                if (part == 'zoom') {
                    obj[part] = parseInt(val);
                } else {
                    obj[part] = val;
                }
                return;
            }

            if (typeof obj[part] === 'undefined') {
                obj[part] = {};
            }
            obj = obj[part];
        });
    }


    /**
     * Copy the scope variables values to the mapOptions.
     * @param scope The scope to get the variables from.
     * @param mapOptions The map options object to apply the settings on.
     */
    function applyAttributes(scope, mapOptions) {
        var attrMap = [
            {'width': 'width'},
            {'height': 'height'},
            {'routeOrigin': 'route.origin.address'},
            {'routeDestination': 'route.destination.address'},
            {'pin': 'pin.address'},
            {'center': 'center.address'},
            {'zoom': 'zoom'},
            {'geocodingApiKey': 'geocoding_api_key'},
            {'mapStyles': 'styles'}
        ];

        attrMap.map(function (mapObj) {
            for (var p in mapObj) {
                if (typeof scope[p] !== 'undefined') {
                    extend(mapOptions, mapObj[p], scope[p]);
                }
            }

        })
    }

    angular.module('xmp.app').directive('xmpMap', ['xmpMapDirectionService', 'xmpMapMarkersService', 'xmpMapAddressesService', '$window',
        function (xmpMapDirectionService, xmpMapMarkersService, xmpMapAddressesService, $window) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    var xmpReady = false;


                    /**
                     * Sets the route for a map.
                     * @param map The map to set the routes on.
                     * @param mapOptions The map options to use to set the route.
                     */
                    function setRoutes(map, mapOptions) {
                        if (mapOptions.routeIcons) {
                            xmpMapDirectionService.setRoute(map, mapOptions.route, mapOptions.routeIcons);
                            return;
                        }

                        xmpMapDirectionService.setRoute(map, mapOptions.route);
                    }

                    /**
                     * Create a new map with the given options.
                     * @param mapOptions The map's options.
                     * @param el The DOM element of the map.
                     */
                    function createMap(mapOptions, el) {
                        var map = new google.maps.Map(el, mapOptions);

                        scope.map = map;

                        if (mapOptions.route) {
                            map.addListener('idle', function () {
                                var addressList = [];
                                if (mapOptions.route.origin.address) {
                                    addressList.push(mapOptions.route.origin.address)
                                }
                                if (mapOptions.route.destination.address) {
                                    addressList.push(mapOptions.route.destination.address)
                                }

                                if (addressList.length == 2) {
                                    xmpMapAddressesService
                                        .getAddressList(addressList, mapOptions.geocoding_api_key)
                                        .then(function (locations) {
                                            angular.extend(mapOptions.route.origin, locations[0]);
                                            angular.extend(mapOptions.route.destination, locations[1]);

                                            setRoutes(map, mapOptions);

                                        });
                                } else {
                                    setRoutes(map, mapOptions);
                                }
                            });
                        }

                        if (mapOptions.pin) {
                            if (mapOptions.pin.address) {
                                xmpMapAddressesService
                                    .getAddress(mapOptions.pin.address, mapOptions.geocoding_api_key)
                                    .then(function (location) {
                                        angular.extend(mapOptions.pin, location);
                                        xmpMapMarkersService.createMarker(map, mapOptions.pin, mapOptions.pin.icon);
                                    });
                            } else {
                                xmpMapMarkersService.createMarker(map, mapOptions.pin, mapOptions.pin.icon);
                            }
                        }
                    }

                    /**
                     * Initialize the directive attributes and map options and creates the map object on the DOM.
                     */
                    function initMap() {
                        setDefaultMapSize(element);

                        // empty the element to allow a refresh of the map
                        element.empty();

                        //create map element div element with default style.
                        var el = document.createElement('div');
                        el.style.width = '100%';
                        el.style.height = '100%';
                        element.prepend(el);

                        var mapOptions = {
                            center: {lat: 0, lng: 0},
                            zoom: 15
                        };

                        // sets the attribute values on the scope and create the map option object.
                        ['width', 'height', 'geocodingApiKey'].map(function (attrName) {
                            scope[attrName] = attr[attrName];
                        });

                        ['options', 'routeOrigin', 'routeDestination', 'zoom', 'pin', 'center','mapStyles'].map(function (attrName) {
                            scope[attrName] = scope.$eval(attr[attrName]);
                        });
                        if (scope.options) {
                            angular.extend(mapOptions, scope.options);
                        }
                        applyAttributes(scope, mapOptions);

                        //sets the default size values of the map.
                        ['width', 'height'].map(function (p) {
                            if (typeof mapOptions[p] !== 'undefined') {
                                element.css(p, mapOptions[p]);
                            }
                        });


                        //start be setting the center of the map if provided.
                        //if not provided use Lat:0 Lng:0.
                        if (mapOptions.center.address) {

                            xmpMapAddressesService
                                .getAddress(mapOptions.center.address, mapOptions.geocoding_api_key)
                                .then(function (location) {
                                    angular.extend(mapOptions.center, location);
                                    createMap(mapOptions, el);
                                });
                        } else {
                            createMap(mapOptions, el);
                        }
                    }

                    function init(){
                        if ($window.__google_api_xmp_map_loaded__ && xmpReady) {
                            initMap();
                        }
                    }

                    // refresh function to allow a refresh of the map from outside of
                    // the directive.
                    scope.reset = function(){
                       initMap();
                    }

                    scope.$on('map-api-ready', function(){
                        $window.__google_api_xmp_map_loaded__ = true;
                        init();
                    });

                    scope.xmpReady(function(){
                        xmpReady = true;
                        init();
                    });

                    [attr.center, attr.pin, attr.routeOrigin, attr.routeDestination].forEach(function(a){
                        scope.$watch(a, function(){
                            init();
                        })
                    });

                }
            };
        }])
}(angular));