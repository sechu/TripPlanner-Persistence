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
    Day.count()
    .then(function (count) {
        res.send(count.toString());
    })
    .catch(next);
});

router.get('/days/:num', function (req, res, next) {
    Day.findOrCreate({
        where: {
            num: req.params.num
        }
    })
    .spread(function (day) {
        return day.returnItinerary();
    })
    .then(function(itinerary) {
        res.send(itinerary);
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
            day.setHotel(hotel);
        });
    })
    .catch(next);
});

router.post('/days/activity', function (req, res, next) {
    var item = req.body.item,
        day = req.body.day;

    Activity.findOne({
        where: {
            name: item
        }
    })
    .then(function (activity) {
        return Day.findOrCreate({
            where: {
                num: day
            }
        })
        .spread(function(day) {
            return day.addActivity(activity);
        })
    })
    .then(function(){
        res.end();
    })
    .catch(next);
});

router.post('/days/restaurant', function (req, res, next) {
    var item = req.body.item,
        day = req.body.day;

    Restaurant.findOne({
        where: {
            name: item
        }
    })
    .then(function (restaurant) {
        return Day.findOrCreate({
            where: {
                num: day
            }
        })
        .spread(function(day) {
            return day.addRestaurant(restaurant);
        })
    })
    .then(function() {
        res.end();
    })
    .catch(next);
});

router.get('/days/delete/:num', function (req, res, next) {
    Day.destroy({
        where: {
            num: req.params.num
        }
    })
    .then(function() {
       return Day.resetDays(req.params.num);
    })
    .then(function() {
        res.send();
    })
    .catch(next);
});

router.get('/location', function (req, res, next) {
    var type = req.query.type;
    var name = req.query.name;

    db.model(type).findOne({
        include: [Place]
    })
    .then(function (attraction) {
        var location = attraction.place.location;
        res.send(location);
    })
    .catch(next);

});


router.get('/:attraction', function (req, res, next) {

    var attraction = req.params.attraction;

    db.model(attraction).findAll({
        include: [Place]
    })
    .then(function (attractionList) {
            res.send(attractionList);
    })
    .catch(next);

});

module.exports = router;
