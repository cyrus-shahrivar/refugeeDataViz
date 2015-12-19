var express = require('express');
var morgan = require('morgan');
var app = express();
var test = require('./models/test.js');
var mongoose = require('mongoose');
var data2012 = require('./models/data2012.js');

app.use(morgan('dev'));

mongoose.connect('mongodb://localhost/refugeeApp', function (err) {
  if(err){
    console.log(err);
  } else {
    console.log('connection successful - server');
  }
});

//much of the below express calls had to be slightly redone due to heroku compatibility
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.render('public/index.html');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

/*NOTE: when importing with mongoimport, collections must be plural (if ending in a letter/word) of your schema/model name.
the get command looks for the plural collection, not the singular. the opposite is true if collection name ends in a number*/
/*mongoimport --db refugeeApp --collection tests --type csv --headerline --file /Users/cyrusshahrivar/projectFinalGA/refugeeDataViz/public/test.csv*/
/*mongoimport --db refugeeApp --collection data2012 --type csv --headerline --file /Users/cyrusshahrivar/projectFinalGA/refugeeDataViz/data/2012CSV.csv*/
app.get("/data2012", function (req, res) {
  data2012.find().exec(function (err, stuff) {
    if (err) return console.error(err);
    console.log(stuff);
    res.send(stuff);
  });
});
