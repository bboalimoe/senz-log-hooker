/**
 * Created by zhanghengyang on 15/4/24.
 */


function Person(){
    var name;
    this.setName = function(theName){
        name = theName;
    };
    this.sayHello = function(){
        console.log('Hello',name);
    };
}
// exports.Person = Person;
module.exports = Person;