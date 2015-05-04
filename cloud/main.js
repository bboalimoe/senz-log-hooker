var publisher = require('cloud/rabbit_lib/publisher');
var express = require("express");
var middle = require("./middlewares");



var app = express();
app.get("/debug/",function(req,res){
    middle.toDebug();
    res.send({"status":"debug mode","logger":"tracer"});

});

app.get("/production/",function(req,res){
    middle.toProd();
    res.send({"status":"production mode","logger":"logentries"});

});

app.get("/train-set/",function(req,res){
    middle.isTraining();
    res.send({"status":"data set is training set"});

});

app.get("/real-data/",function(req,res){
    middle.isNotTraining();
    res.send({"status":"data set is not training set"});

});




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