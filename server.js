console.log('May Node be with you')

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
//app.set('view engine', 'ejs')
const MongoClient = require('mongodb').MongoClient;

var path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use('/images', express.static(__dirname + 'public'));
//app.use(express.static(path.join(__dirname, 'public')));
//app.use('/static', express.static('public'))

var db
//var view = 'index.ejs'

MongoClient.connect('mongodb://me:123qwe@ds153609.mlab.com:53609/practice-database', (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(3000, () => {
    console.log('listening on 3000');
  });
});

/*app.listen(3000, function(){
  console.log('listening on 3000');
  })*/



app.post('/quotes', (req, res) => {
  console.log(req.body)
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })

})

app.get('/', (req, res) => {
  /*db.collection('quotes').find().toArray((err, result) => {
    //if (err) return console.log(err)
    // renders index.ejs
    //res.render('index.ejs', {quotes: result})
    console.log(result);
  })*/
  res.sendFile(__dirname + '/index.html')
})

app.get('/data', function (req, res) {
  //res.send('hello world'); //replace with your data here
  db.collection('quotes').find().toArray(function (err, results) {
    console.log(results);
    res.send(results);
  });
});


