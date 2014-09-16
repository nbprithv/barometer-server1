var express = require('express');
var geolib = require('geolib');
var router = express.Router();
var async = require('async');

var place = function (req, res) {
};

place.prototype.addPlace = function (req, res) {
    if (req.body && req.body.name && req.body.address && req.body.latitude && req.body.longitude) {
        req.db.addPlace(req.body, function (err, results) {
            console.log(results);
            res.render('addPlace', {success:1});    
        });
    } else {
        res.render('addPlace');    
    }
};

place.prototype.getPlace = function (req, res) {
    var places = {},// = req.db.getPlaces(),
        currlong = -122.025168;//req.query.currlong,
        currlat = 37.417277;//req.query.currlat;
    places.results = {};

    req.db.getPlaces(function (err, results) {
        places.results = results;
        for (var i = 0; i < places.results.length; i++) {
            var distance = geolib.getDistance({latitude: currlat, longitude: currlong},
                                    {latitude: places.results[i].latitude, longitude: places.results[i].longitude}, 10);
            places.results[i]['distance_km'] = Math.round(distance * 0.001 * 10) / 10;

            distance = Math.round(distance * 0.00062 * 10) / 10;
            places.results[i]['distance_miles'] = distance;
        }
        places.results = quickSort(places.results, 0, places.results.length - 1, 'distance_km');
        res.set('Content-Type', 'application/json');
        res.json(places);
    });
};

place.prototype.logLocation = function (req, res) {
};

module.exports = function (req, res) {
    var action = req.query && req.query.action, places = new place();
    switch (action) {
        case 'get_places': 
            places.getPlace(req, res);
            break;
        case 'add_place':
            places.addPlace(req, res);
            break;
        case 'log_location':
            places.logLocation(req, res);
            break;
        default:
            res.send('action isnt defined');
            break;
    };
    
};

function swap(items, firstIndex, secondIndex){
    var temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
}

function partition(items, left, right, key) {
    var pivot = items[Math.floor((right + left) / 2)][key], i = left, j = right;
    while (i <= j) {
        while (items[i][key] < pivot) {
            console.log(items[i][key]);
            i++;
        }
        while (items[j][key] > pivot) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
        }
    }
    return i;
}

function quickSort(items, left, right, key) {
    var index;
    if (items.length > 1) {
        index = partition(items, left, right, key);
        if (left < index - 1) {
            quickSort(items, left, index - 1, key);
        }
        if (index < right) {
            quickSort(items, index, right, key);
        }
    }
    return items;
}
