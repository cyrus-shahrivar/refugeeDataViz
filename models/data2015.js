var mongoose = require('mongoose');


var data2015Schema = new mongoose.Schema({
  "State" : String,
  "TOTAL" : Number
});

var data2015 = mongoose.model('data2015', data2015Schema);

module.exports = data2015;
