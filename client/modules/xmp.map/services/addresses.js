(function (angular) {
    angular.module('xmp.app').service('xmpMapAddressesService', ['$http', '$log', '$q', function ($http, $log, $q) {
        var getAddress = function (address, apiKey) {
                var deferred = $q.defer();

                if (!apiKey) {
                    var reason = 'Google developer API key must be specified for addresses service to work.';
                    $log.error(reason);
                    deferred.reject(reason);
                    return;
                }

                $http.get("https://maps.googleapis.com/maps/api/geocode/json?app_key="+apiKey+"&address="+ address.replace(/ /g, '+'))
                    .then(function (obj) {
                        if (obj.data.status == 'ZERO_RESULTS') {
                            var reason = 'Google Geocoding API produced no results';
                            $log.error(reason)
                            deferred.reject(reason);
                            return;
                        }
                        if (obj.data.results && obj.data.results.length > 0) {
                            deferred.resolve(obj.data.results[0].geometry.location);
                            return;
                        }
                        deferred.resolve({});
                    }, function (error) {
                        var reason = 'Error while accessing Google Geocoding: ' + error;
                        $log.error(reason);
                        deferred.resolve(reason);
                        return;
                    });
                return deferred.promise;

            },

            getAddressList = function (addresses, apiKey) {

                var deferred = $q.defer(),
                    result = [],
                    addressIndex = addresses.length,
                    requestAddress = function (location) {
                        if (location) {
                            result.unshift(location);
                        }
                        addressIndex--;

                        if (addressIndex > -1) {
                            getAddress(addresses[addressIndex], apiKey).then(requestAddress)
                        } else {
                            deferred.resolve(result);
                        }
                    };

                if (!apiKey) {
                    var reason = 'Google developer API key must be specified for addresses service to work.';
                    $log.error(reason);
                    deferred.reject(reason);
                    return;
                }

                requestAddress();

                return deferred.promise;
            };

        return {
            getAddress: getAddress,
            getAddressList: getAddressList
        };
    }]);

}(angular));