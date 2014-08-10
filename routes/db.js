var pg = require('pg');
var async = require('async');

var dbClass = function (config) {
    this.config = config;
    this.connstring = "postgres://"+config.dbuser+":"+config.dbpw+"@"+config.dbhost+"/"+config.dbname;
};

dbClass.prototype.addPlace = function (obj, cb) {
    pg.connect(this.connstring, function(err, client, cb) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        
        client.query("INSERT INTO places (name, address, latitude, longitude) VALUES ('"+obj.name+"', '"+obj.address+"', '"+obj.latitude+"', '"+obj.longitude+"')",
            function(err, results) {
                if(err) {
                    return console.error('error running query', err);
                }
                cb(err, results);
            }
        );
    });
};

dbClass.prototype.getPlaces = function (cb) {
    var ret = [];
    pg.connect(this.connstring, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        
        client.query("SELECT * FROM places",
            function(err, results) {
                done();
                if(err) {
                    return console.error('error running query', err);
                }
                cb(err, results.rows);
            }
        );
    });
};

module.exports = dbClass;
