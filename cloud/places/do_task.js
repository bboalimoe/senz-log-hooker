/**
 * Created by zhanghengyang on 15/4/23.
 */

var config = require("cloud/places/config.js").config;
var m_cache = require("location-cache");
var AV = require("avoscloud-sdk").AV;
var interval = require("cloud/places/lib/interval");
var req_lib = require("cloud/places/lib/http_wrapper");


var suc_ids = [];//global value for filter the final save rawDataIds.

var request_ids = new Set(); //global value for deletion

var fetch_trace = function(ids){
    //questions on whether to set a request timeout
    console.log("fetch trace starting !!!!!!")
    var UserLocation = AV.Object.extend(config.source_db.target_class);

    var query_promise = function(id) {
        var promise = new AV.Promise();
        var query = new AV.Query(UserLocation);
        query.equalTo("objectId", id);
        console.log("request id =====>>>>" + id);
        query.find().then(
            function (o) {
                console.log(JSON.stringify(o));
                console.log("object" + o[0]);
                o = o[0];
                console.log("js fetch trace success");
                var a = {};
                var user = o.get("user");
                var location = o.get("location");
                var timestamp = o.get("timestamp");
                a[o.id] = {
                    "location": location,
                    "user": user,
                    "timestamp": timestamp
                };
                m_cache.get(o.id)["user"] = user;
                suc_ids.push(id);
                promise.resolve(a);
            },
            function (err) {
                //
                promise.resolve(id);
                console.log("error is " + err);
                console.log("error id is " + id);
            }
        );
        return promise;

    };
    var promises = [];
    ids.forEach(function(id) {
        promises.push(query_promise(id));
    });
    return AV.Promise.all(promises);

};

var batch_body = function(obj_l){
    /// batch request body for poi service

    console.log("object list is ,%s >>>>>",JSON.stringify(obj_l));
    var l = [];
    obj_l.forEach(function(obj){
        //console.log("obj is >>>>>>>>" + JSON.stringify(obj));
        var a = new Object();
        var id = Object.keys(obj)[0];
        a["timestamp"] = obj[id].timestamp;
        a["objectId"] = id;
        a["location"] = obj[id].location;
        //console.log("a is " + JSON.stringify(a));
        l.push(a);
    });

    var body = {"locations":l};
    //console.log("body is ,%s",JSON.stringify(body));

    return body

};


function location_service(body,mode){
    ///poi service request need the auth key! do not forget
    /// 3 max retries
    /// mode : batch ; once
    /// keep the request waiting time being 1/2 of timer interval

    var serv_url = config.serv_url;
    var timeout = 0.5 * interval.task_interval.check_interval;

    console.log("request the poi type of specific geopoint ");
    //http batch request
    return req_lib.batch_post(serv_url,body,timeout);
    //var sound_post = function(url,params,success_cbk,max_timeout){


}


var cache_purge = function(suc_ids){

    suc_ids.forEach(function(id){

        m_cache.del(id);

    });

    suc_ids.forEach(function(id){
        request_ids.delete(id);
    })

    var fail_ids = request_ids;

    fail_ids.forEach(function(id){
        m_cache.get(id).tries += 1;


    });
}

var write_batch_data = function(body){
    //set a request timeout
    console.log(body);
    app_key = config.target_db.APP_KEY;
    //var lean_post = function(target_class,APP_ID,APP_KEY,params,success_cbk,fail_cbk){
    app_id = config.target_db.APP_ID;
    return req_lib.lean_post(app_id,app_key,body);

}

var expired = function(values){

    if (values.tries >= 3) {

        request_ids.delete(id);
        return m_cache.del(id);

    }
};

var check_exhausted = function(i){

    var p = {};
    var ids = request_ids;
    ids.forEach(function (id) {

        console.log("id =====> " + id);
        console.log("start fetch objects from cache " + m_cache.get(id));
        var r = expired(m_cache.get(id));

        if (!r) {
            console.error("there is one error when deletion");
        }

    });
};

var get_cache_ids = function(){

    var id_set = new Set();
    m_cache.keys().forEach(function(id) {
        id_set.add(id);
    });
    return id_set
}

var start = function(){

    console.log("task started");
    request_ids = get_cache_ids();

    console.log("request_ids" + request_ids);

    if (!request_ids.size) {
        console.log("empty list");
        return;
    }
    check_exhausted();
    var promise = fetch_trace(request_ids);
    promise.then(
        function (local_fetch_objs) {

            var temp_list  = [];
            local_fetch_objs.forEach(function(e){
                if (typeof e != typeof "1"){
                    temp_list.push(e);
                }
            });
            var body = batch_body(temp_list);
            var p = location_service(body, "batch");
            p.then(
                function (tuple) {

                    console.log("req service success");
                    suc_ids = tuple[1];
                    return write_batch_data(tuple[0]);
                },
                function () {
                    console.log("req service failed");

                }
            ).then(
                function(body){

                    body.forEach(function(obj){
                        if("error" in obj){
                            delete suc_ids[body.indexOf(obj)];
                        }
                    })
                    console.log("succeessfully retrieved object ids" + suc_ids);
                    cache_purge(suc_ids);
                    console.log("one process end success");
                    console.log("##############\n############\n###########");

                },
                function(result){
                    console.log("one process end failed");
                    console.log("##############\n############\n###########");

                }
            )

        },
        function (errors) {

            console.log("id list retrieve failed, failed ids are ,%s",errors);
        })

    };


exports.start = start ;