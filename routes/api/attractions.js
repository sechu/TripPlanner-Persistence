var express = require('express');
var router = express.Router();
var db = require('../../models');
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');
var Place = require('../../models/place');
var Day = require('../../models/day');
var Promise = require('bluebird');

router.get('/days', function (req, res, next) {
    Day.findAll()
    .then(function (allDays) {
        res.send(allDays);
    })
    .catch(next);
});

router.get('/days/:num', function (req, res, next) {
    Day.findOne({
        where: {
            num: req.params.num
        }
    })
    .then(function (oneDay) {
        res.send(oneDay);
    })
    .catch(next);
});

router.post('/days/hotel', function (req, res, next) {
    var item = req.body.item,
        day = req.body.day;

    Hotel.findOne({
        where: {
            name: item
        }
    })
    .then(function (hotel) {
        return Day.findOrCreate({
            where: {
                num: day
            }
        })
        .spread(function(day) {
            console.log(day);
            day.setHotel(hotel);
        });
    })
    .catch(next);
});

router.post('/days/hotel', function (req, res, next) {
    var item = req.body.item,
        day = req.body.day;

    Hotel.findOne({
        where: {
            name: item
        }
    })
    .then(function (hotel) {
        return Day.findOrCreate({
            where: {
                num: day
            }
        })
        .spread(function(day) {
            console.log(day);
            day.setHotel(hotel);
        });
    })
    .catch(next);
});

router.post('/days/hotel', function (req, res, next) {
    var item = req.body.item,
        day = req.body.day;

    Hotel.findOne({
        where: {
            name: item
        }
    })
    .then(function (hotel) {
        return Day.findOrCreate({
            where: {
                num: day
            }
        })
        .spread(function(day) {
            console.log(day);
            day.setHotel(hotel);
        });
    })
    .catch(next);
});


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
