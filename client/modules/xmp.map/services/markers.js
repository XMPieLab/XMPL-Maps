(function(angular){
    angular.module('xmp.app').service('xmpMapMarkersService', function(){
        var createMarker = function(map, position, icon) {
                new google.maps.Marker({
                    position: position,
                    map: map,
                    icon: icon ? icon : undefined
                });
        }
        ;
        return {
            createMarker: createMarker
        };
    });
}(angular));