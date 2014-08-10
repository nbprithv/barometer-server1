var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('barometer.sqlite');
var async = require('async');

var dbClass = function () {
};

dbClass.prototype.addPlace = function (obj) {
    var stmt = db.prepare("INSERT INTO places (name, address, latitude, longitude) VALUES ('"+obj.name+"', '"+obj.address+"', '"+obj.latitude+"', '"+obj.longitude+"')");
    stmt.run();
    stmt.finalize();
    return 1;
};

dbClass.prototype.getPlaces = function (cb) {
    var ret = [];
    db.each("SELECT * FROM places",
    function(err, row) {
        ret.push(row);
    },
    function (err, ctx){
        cb('', ret);
    });
};

module.exports = dbClass;
