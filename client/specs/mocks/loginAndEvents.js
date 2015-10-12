
angular.module('test.xmp.app').run(function($httpBackend) {

    $httpBackend.whenPOST(/\/login/).respond(function(method, url) {

        return [200,{}];
    });

    $httpBackend.whenPOST(/\/events/).respond(function(method, url) {

        return [200,{}];
    });

});

