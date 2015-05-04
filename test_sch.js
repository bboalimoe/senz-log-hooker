

var a = require("location-cache");
var b = require("sound-cache");
a.put(1,2)
b.put(2,3)
a.put(3,4)
b.put(4,5)
console.log("a keys " + a.keys());
console.log("b keys " + b.keys());

exports.a = {"a":"b"};
