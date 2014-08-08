var express = require('express');
var geolib = require('geolib');
var router = express.Router();

var place = function (req, res) {
};

place.prototype.getPlace = function (req, res) {
    var places = require('../places.json');
    for (var i = 0; i < places.results.length; i++) {
        var distance = geolib.getDistance({latitude: 37.78583400, longitude: -122.40641700},
                                {latitude: places.results[i].latitude, longitude: places.results[i].longitude}, 10);
        places.results[i].distance_km = Math.round(distance * 0.001 * 10) / 10;

        distance = Math.round(distance * 0.00062 * 10) / 10;
        places.results[i].distance_miles = distance;
    }
    "37.78583400 -122.40641700";
    res.send(places);
};


module.exports = function (req, res) {
    var action = req.query && req.query.action, places = new place();
    console.log(action);
    switch (action) {
        case 'get_places': 
            places.getPlace(req, res);
            break;
        default:
            res.send('action isnt defined');
            break;
    };
    
};
