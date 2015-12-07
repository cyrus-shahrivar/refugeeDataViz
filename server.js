var express = require('express');
var morgan = require('morgan');
var app = express();
var data = require('./data/2014_refugees.json');

app.use(morgan('dev'));
app.listen(3000, function () {
  console.log("working on port 3000");
});
app.use(express.static(__dirname+'/public'));

app.get("/data", function (req,res) {
  res.send(data);
});
