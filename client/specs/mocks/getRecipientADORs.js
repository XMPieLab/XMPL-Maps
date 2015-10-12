angular.module('test.xmp.app').run(function($httpBackend) {

    $httpBackend.whenGET(/XMPieXMPL_REST_API\/resource\//).respond(function(method, url) {

        return [200,{"result":{"Favorite":"Pasta","Fname":"Yaron","Lname":"Tomer","Gender":"M"},"login":{"recipientID":"yaron.tomer","serviceToken":""}}];
    });

});

