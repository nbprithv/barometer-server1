var mysql = require('mysql');
var async = require('async');

var dbClass = function (config) {
    this.config = config;
    this.connstring = "postgres://"+config.dbuser+":"+config.dbpw+"@"+config.dbhost+"/"+config.dbname;

    try {
        this.connection = mysql.createConnection({
            host     : config.dbhost,
            port     : config.dbport,
            user     : config.dbuser,
            database : config.dbname,
            password : config.dbpw
        });
        this.connection.connect();
    } catch (err) {
        console.log(err.message);
    }
};


dbClass.prototype.addPlace = function (obj, cb) {
    this.connection.query("INSERT INTO places (name, address, latitude, longitude) VALUES ('"+obj.name+"', '"+obj.address+"', '"+obj.latitude+"', '"+obj.longitude+"')", function(err, results) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        cb(err, results);
    });
//    pg.connect(this.connstring, function(err, client, done) {
//        if(err) {
//            return console.error('error fetching client from pool', err);
//        }
//        
//        client.query("INSERT INTO places (name, address, latitude, longitude) VALUES ('"+obj.name+"', '"+obj.address+"', '"+obj.latitude+"', '"+obj.longitude+"')",
//            function(err, results) {
//                done();
//                if(err) {
//                    return console.error('error running query', err);
//                }
//                cb(err, results);
//            }
//        );
//    });
};

dbClass.prototype.getPlaces = function (cb) {
    var ret = [];
    this.connection.query("SELECT * FROM places", function(err, rows, fields) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        cb(err, rows);
    });
//    pg.connect(this.connstring, function(err, client, done) {
//        if(err) {
//            return console.error('error fetching client from pool', err);
//        }
//        
//        client.query("SELECT * FROM places",
//            function(err, results) {
//                done();
//                if(err) {
//                    return console.error('error running query', err);
//                }
//                cb(err, results.rows);
//            }
//        );
//    });
};

module.exports = dbClass;
