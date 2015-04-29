/**
 * Created by zhanghengyang on 15/4/24.
 */
var req = require("request");
var m_cache = require("location-cache");
var config = require("cloud/places/config.js").config;
var type = require("cloud/places/lib/lean_type.js");

var suc_ids = [];

var lean_post = function (APP_ID, APP_KEY, params) {
    console.log("fuck here");
    console.log("body params,%s,%s", (typeof params), JSON.stringify(params));
    var promise = new AV.Promise();
    req.post(
        {
            url: "https://leancloud.cn/1.1/batch",
            headers:{
                "X-AVOSCloud-Application-Id":APP_ID,
                "X-AVOSCloud-Application-Key":APP_KEY
            },
            json: params

        },
        function(err,res,body){

            if(err != null ){ promise.reject("batch request ERROR");}

            else {
                console.log("request error log is,%s", err);
                var body_str = JSON.stringify(body)
                console.log("body is ,s%", body_str);

                promise.resolve(body);
            }
        }
    );
    return promise
   /// promise 传出去。。
};

var batch_body = function (req_list) {

    var body = {};
    var single = {};
    body["requests"] = [];
    var lean_list = [];
    req_list.forEach(function (b) {
        var temp = {};
        temp["method"] = "POST";
        temp["path"] = "/1.1/classes/" + config.target_db.target_class;
        temp["body"] = b;
        lean_list.push(temp);
    });
    body["requests"] = lean_list;

    console.log("batch requests body " + body);

    return body

}

var load_data = function(body) {

    var single_req_list = [];
    //console.log("response results" + typeof json_body);
    body.results.parse_poi.forEach(function (obj) {
        var mid = {};
        pois = obj.pois;
        var most_probable_poi = pois.sort(
            function (a, b) {
            return parseFloat(a.distance) - parseFloat(b.distance)
        })[0];
        suc_ids.push(obj.objectId);
        mid["userRawdataId"] = obj.objectId;
        mid["timestamp"] = obj.timestamp;
        mid["processStatus"] = "untreated";
        mid["poiType"] = most_probable_poi.poiType;
        mid["poiName"] = most_probable_poi.name;
        console.log("obj  + ======>>" + obj.objectId);

        console.log("user id  ====>" + m_cache.get(obj.objectId)["user"].id)
        mid["user"] = type.leanUser(m_cache.get(obj.objectId)["user"].id);
        single_req_list.push(mid);
        console.log("mid\n" + JSON.stringify(mid));

    });
    return [single_req_list,suc_ids];
}
var batch_post = function (url, params, max_timeout) {

    var promise = new AV.Promise();
    req.post(
        {
            url: url,
            //url:"http://httpbin.org/post",
            json: params,
            timeout:max_timeout

        },
        function(err,res,body){
            if(err != null ){ promise.reject("request error");}
            else {
                var body_str = JSON.stringify(body);
                console.log("body is ,s%", body_str);
                var tuple = load_data(body);
                //todo do the error ids' removments after the serv post response
                ///write_in_db body wrapping
                promise.resolve( [batch_body(tuple[0]),tuple[1]] );
            }
        }
    );
    return promise;
};


exports.batch_post = batch_post;
exports.lean_post = lean_post;
