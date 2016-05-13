var Sequelize = require('sequelize');
var db = require('./_db');
var Promise = require('bluebird');
var Place = require('../models/place');


var Day = db.define('day', {
  num: {
  	type: Sequelize.INTEGER,
  }
}, {
	instanceMethods: {
		returnItinerary: function() {
			return Promise.all([
				this.getHotel({
					include: [Place]
				}),
				this.getRestaurants({
					include: [Place]
				}),
				this.getActivities({
					include: [Place]
				})
			])
			.spread(function(hotel, restaurants, activities) {
				return {
					hotel: [hotel],
					restaurant: restaurants,
					activity: activities
				}
			})
			.catch(console.error)
		}
	}

});


module.exports = Day;
