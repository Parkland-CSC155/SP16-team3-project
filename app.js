var express = require('express');
var fs = require('fs');
var app = express();
var path = require('path');
var port = process.env.PORT||3000;


app.set("view engine", 'ejs');
app.set('views', path.join(__dirname,'views'));

app.get('/', function(req,res, next){
   res.render('index');
});



app.use('/api', require('./routes/api'));
app.use('/calc', require('./routes/calc'));

//app.use(express.static(path.join(__dirname, 'public/js')));
app.use(express.static('public'));

app.listen(port, function(){
    console.log("listening to port " + port);
});