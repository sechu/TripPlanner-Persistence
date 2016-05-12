var Sequelize = require('sequelize');
var db = require('./_db');


var Day = db.define('day', {
  num: {
  	type: Sequelize.INTEGER,
  }
});


module.exports = Day;
