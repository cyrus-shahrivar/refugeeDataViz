var Test = require('./models/test.js'),
    mongoose = require('mongoose');

//connect to mongo database
mongoose.connect('mongodb://localhost/refugeeApp', function (err) {
  if(err){
    console.log(err);
  } else {
    console.log('connection successful - seed');
  }
});


var toDosSeed = new Test(
  {
    states:"KENTUCKY",
    people: 40
  }
);


toDosSeed.save(function (err, docs) {
  if (err) {
      console.log(err);
  } else {
      console.info('todos seed was successfully stored.', docs.length);
  }
});
