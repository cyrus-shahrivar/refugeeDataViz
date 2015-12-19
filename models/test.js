var mongoose = require('mongoose');


var testSchema = new mongoose.Schema({
  "states": String,
  "people": Number,
});

var test = mongoose.model('test', testSchema);

module.exports = test;
