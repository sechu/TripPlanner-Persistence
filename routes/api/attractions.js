var express = require('express');
var router = express.Router();
var db = require('../../models');
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');
var Place = require('../../models/place');
var Promise = require('bluebird');

router.get('/:attraction', function (req, res, next) {

    var attraction = req.params.attraction;
    console.log(attraction);

    db.model(attraction).findAll({
        include: [Place]
    })
    .then(function (attractionList) {
            res.send(attractionList);
    })
    .catch(next);

});

module.exports = router;
