var publisher = require('cloud/rabbit_lib/publisher');
var bd_poi = require("cloud/places/init");
var sound = require("cloud/sounds/init");
var motion = require("cloud/motions/init");
var req = require("request");
//initiate the baidu_poi process
//bd_poi.init();
sound.init();
//motion.init();

AV.Cloud.define("hello", function(request, response) {
    response.success("Hello world!");
});

AV.Cloud.afterSave('UserLocation', function(request) {
    console.log('There is a new location comming.');
    msg = {
        'objectId': request.object.id,
        'timestamp': Date.now()
    };
    console.log('The new location object id: ' + request.object.id);
    publisher.publishMessage(msg, 'new_location_arrival');
});

AV.Cloud.afterSave('UserMic', function(request) {
    console.log('There is a new sound comming.');
    msg = {
        'objectId': request.object.id,
        'timestamp': Date.now()
    };
    console.log('The new sound object id: ' + request.object.id);
    publisher.publishMessage(msg, 'new_sound_arrival');
});

AV.Cloud.afterSave('UserSensor', function(request) {
    console.log('There is a new motion comming.');
    msg = {
        'objectId': request.object.id,
        'timestamp': Date.now()
    };
    console.log('The new motion object id: ' + request.object.id);
    publisher.publishMessage(msg, 'new_motion_arrival');
});