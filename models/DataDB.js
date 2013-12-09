var settings        = require('../config.js'),
    Db              = require('mongodb').Db,
    Connection      = require('mongodb').Connection,
    Server          = require('mongodb').Server;
    Database  = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT), {safe: true});

function insert(table, data, callback){
    Database.open(function(err, db){
        if(err){
            return callback(err);
        }else{
            db.collection(table, function(err, collection){
                if(err){
                    Database.close();
                    return callback(err);
                }else{
                    collection.insert(data, {
                        safe : true
                    }, function(err, obj){
                        Database.close();

                        if(err){
                            return callback(err);
                        }else{
                            callback(null, data[0]);
                        }
                    });
                }
            });
        }
    });
}

function remove(table, key, callback){
    Database.open(function(err, db){
        if(err){
            return callback(err);
        }else{
            db.collection(table, function(err, collection){
                if(err){
                    Database.close();
                    return callback(err);
                }else{
                    collection.remove(key, {w : 1}, function(err){
                        Database.close();

                        if(err){
                            return callback(err);
                        }else{
                            callback(null);
                        }
                    });
                }
            });
        }
    });
}

function update(table, key, data, callback){
    Database.open(function(err, db){
        if(err){
            return callback(err);
        }else{
            db.collection(table, function(err, collection){
                if(err){
                    Database.close();
                    return callback(err);
                }else{
                    collection.update(key, {
                        $set : data
                    }, function(){
                        Database.close();
                        if(err){
                            return callback(err);
                        }else{
                            callback(null);
                        }
                    });
                }
            });
        }
    });
}

function find(table, key, callback){
    Database.open(function(err, db){
        if(err){
            return callback(err);
        }else{
            db.collection(table, function(err, collection){
                if(err){
                    Database.close();

                    return callback(err);
                }else{
                    collection.find(key).toArray(function(err, data){
                        Database.close();

                        if(err){
                            return callback(err);
                        }else{
                            callback(null, data);
                        }
                    });
                }
            });
        }
    });
}

function findOne(table, key, callback){
    Database.open(function(err, db){
        if(err){
            return callback(err);
        }else{
            db.collection(table, function(err, collection){
                if(err){
                    Database.close();

                    return callback(err);
                }else{
                    collection.findOne(key, function(err, data){
                        Database.close();

                        if(err){
                            return callback(err);
                        }else{
                            callback(null, data);
                        }
                    });
                }
            });
        }
    });
}

module.exports = {
    insert  : insert,
    remove  : remove,
    update  : update,
    find    : find,
    findOne : findOne
};