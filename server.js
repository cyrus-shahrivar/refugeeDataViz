var express = require('express');
var morgan = require('morgan');
var app = express();
// var data = require('./data/2014_refugees.json');
// var mongoose = require('mongoose');
// var refugees2014 = require('./models/2014.js');
// var sentiment = require('sentiment');

// mongoose.connect('mongodb://localhost/refugeeApp', function (err) {
//   if(err){
//     console.log(err);
//   } else {
//     console.log('connection successful - server');
//   }
//
//
// });

// var r1 = sentiment('OTTAWA — Canada welcomed 163 Syrian refugees under its new accelerated entry program late Thursday night, the first of 25,000 the country has promised to take in by March. FROM OUR ADVERTISERSPrime Minister Justin Trudeau and a battery of politicians from across the political spectrum were on hand at the Toronto airport to greet the refugees. “You are home,” Mr. Trudeau said to the first passengers to disembark after a 16-hour flight from Beirut on a Canadian military aircraft. “You’re safe at home now.” The premier of Ontario, Kathleen Wynne, gave them winter coats. Under a plan announced by Mr. Trudeau’s new government, a series of flights will bring 10,000 Syrian refugees into Canada by the end of this month and a total of at least 25,000 before March. The widespread embrace of the plan by the Canadian public stands in stark contrast with the controversy raging over the issue in the United States, where many politicians, especially on the right, have called for bans or restrictions on the admission of Syrian refugees.');
// console.dir(r1);        //

app.use(morgan('dev'));
// app.listen(3000, function () {
//   console.log("working on port 3000");
// });
// app.use(express.static(__dirname+'/public'));


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('public/index.html');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


// //getting same error with
// app.get("/2014data", function (req, res) {
//   refugees2014.find().exec(function (err, stuff) {
//     console.log(stuff);
//         console.log(err)
//     res.send(stuff);
//
//   });
// });
