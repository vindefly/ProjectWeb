var DataDB = require('./DataDB.js');
var tablename = 'topic';

function Topic(topic) {
    this.names  = topic.names;
    this.users  = topic.users;
    this.pic    = topic.pic;
    this.url    = topic.url;
    this.types  = topic.types;
}

module.exports = Topic;

var date = new Date();
//存储各种时间格式，方便以后扩展
var time = {
    date    : date,
    year    : date.getFullYear(),
    month   : date.getFullYear() + "-" + (date.getMonth() + 1),
    day     : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    minute  : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
};

Topic.prototype.insert = function(callback){
    var data = {
        names   : this.names,
        users   : this.users,
        pic     : this.pic,
        url     : this.url,
        types   : this.types,
        day     : time
    };
    DataDB.insert(tablename, data, callback);
};

Topic.find = function(key, callback){
    DataDB.find(tablename, key, callback);
};

Topic.findOne = function(key, callback){
    DataDB.findOne(tablename, key, callback);
};

Topic.update = function(key, data, callback){
    DataDB.update(tablename, key, data, callback);
};

Topic.remove = function(key, callback) {
    DataDB.remove(tablename, key, callback);
};