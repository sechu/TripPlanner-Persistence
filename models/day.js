var Sequelize = require('sequelize');
var db = require('./_db');
var Promise = require('bluebird');
var Place = require('../models/place');


var Day = db.define('day', {
  num: {
  	type: Sequelize.INTEGER,
  }
}, {
	classMethods: {
		resetDays: function(deletedDayNum){
			return Day.findAll({
				where: {
					num: {
						gt: deletedDayNum
					}
				}	
			})
			.then(function(daysArray) {
				console.log(daysArray);
				daysArray.forEach(function(day) {
					day.num -= 1;
					day.save();
				});
			})
			.catch(console.error);
		}
	},
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
