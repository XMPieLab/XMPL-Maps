
angular.module('test.xmp.app').run(function($httpBackend) {

    $httpBackend.whenGET(/\.*/).passThrough();
    $httpBackend.whenPOST(/\.*/).passThrough();
    $httpBackend.whenPUT(/\.*/).passThrough();

});