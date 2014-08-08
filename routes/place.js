var express = require('express');
var router = express.Router();

var place = function (req, res) {
};

place.prototype.getPlace = function (req, res) {
    var places = require('../places.json');
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
