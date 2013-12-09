var DataDB      = require('./DataDB.js');
var tablename   = 'users';

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
}

module.exports = User;

User.prototype.insert = function(callback){
    var data = {
        name    : this.name,
        password: this.password,
        email   : this.email
    };

    DataDB.insert(tablename, data, callback);
};

User.findOne = function(key, callback){
    DataDB.findOne(tablename, key, callback);
};

User.find = function(callback){
    DataDB.find(tablename, {}, callback);
};

User.update = function(key, data, callback){
    DataDB.update(tablename, key, data, callback);
};

User.remove = function(key, callback){
    DataDB.remove(tablename, key, callback);
};