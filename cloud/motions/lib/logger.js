/**
 * Created by zhanghengyang on 15/4/29.
 */
var config = require("cloud/motions/config.js").config;
var log_tag = config.log_tag;

if(config.debug){
    var log = require("tracer").colorConsole();
}
else{
    var logentries = require('node-logentries');
    var log = logentries.logger({
        token:'1a528118-f843-4124-87d9-2843eace4998'
    });
}


exports.info = function(info){
    log.info(log_tag + info);
}

exports.debug = function(debug){
    log.debug(log_tag + debug);
}


////exports.notice = function(notice){
//    log.notice(log_tag + notice);
//}

exports.warning = function(warning){
    log.warning(log_tag + warning);
}

exports.error = function(err){
    log.error(log_tag + err);
}

//exports.alert = function(alert){
//    log.alert(log_tag + alert);
//}