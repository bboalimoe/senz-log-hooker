/**
 * Created by zhanghengyang on 15/4/22.
 */

var sub = require('cloud/rabbit_lib/subscriber');
var m_cache = require("motion-cache");
var m_task = require("cloud/motions/do_task");
var interval = require("cloud/motions/lib/interval");
var task_interval = interval.task_interval.check_interval;
var prev_interval = interval.prev_interval;
var logger = require("cloud/motions/lib/logger");




///*
//A new motion rawdata arrival called 'new_motion_arrival'
//A new sound rawdata arrival called 'new_sound_arrival'.
//    A new location rawdata arrival called 'new_location_arrival'.



var event = "new_motion_arrival";
var queue_name = "motions";


exports.init = function(){

    //


    sub.registerEvent(GoProcess,queue_name,event);
    logger.debug("task_interval " + task_interval);


    setInterval(
        function () {
        if(m_cache.size()>0){
            var keys = m_cache.keys();
            var id = keys.pop();
            if(3>m_cache.get(id).tries>0 ){
                logger.warning("request pre-failed id service started, id >>" + id);
                m_task.start(id);
            }
        }

    },task_interval);

    //var rule = new timer.RecurrenceRule();
    //rule.minute = task_interval.check_interval;
    //var job = timer.scheduleJob(rule,m_task.start);
    //var cycle_check = timer.scheduleJob(rule,function(){
    //
    //    if (task_interval.check_interval === prev_interval){
    //
    //    }
    //    else {
    //        job.cancel();
    //        rule.minute = check_interval;
    //        job = timer.scheduleJob(rule,m_task.start);
    //    }
    //});

};

var GoProcess = function(msg)
{
    logger.info("a new motion data arrived");
    logger.info("data is " + msg);
    var obj = {};
    obj["timestamp"] = msg.timestamp;
    obj["tries"] = 0;
    obj["user"] = {};
    m_cache.put(msg.objectId,obj);
    logger.warning("request new id service started, id >>" + id);
    m_task.start(msg.objectId);


}