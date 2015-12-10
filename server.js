var express = require('express');
var morgan = require('morgan');
var app = express();
var data = require('./data/2014_refugees.json');
var mongoose = require('mongoose');
var refugees2014 = require('./models/2014.js');

mongoose.connect('mongodb://localhost/refugeeApp', function (err) {
  if(err){
    console.log(err);
  } else {
    console.log('connection successful - server');
  }
});


app.use(morgan('dev'));
app.listen(3000, function () {
  console.log("working on port 3000");
});
app.use(express.static(__dirname+'/public'));

app.get("/data", function (req,res) {
  res.send(data);
});

//getting same error with
app.get("/2014data", function (req, res) {
  refugees2014.find().exec(function (err, stuff) {
    console.log(req);
    console.log(res);
    console.log(stuff);
    res.send(stuff);
  });
});
