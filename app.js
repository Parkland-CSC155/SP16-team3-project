
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var port = process.env.PORT||3000;
var fs = require('fs');
// setups
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
jsonData = fs.readFileSync('./data/breaking_bad.json');
jsonData = JSON.parse(jsonData);
var episodesData = jsonData._embedded.episodes;
var episode;

app.use(function(req, res, next){
	console.log('requiest!!');
	var log = "request url:" + req.url;
	console.log(log);
	next();
});
app.get("/", function(req, res, next){
	res.send('Try harder.');
});

app.get("/episodes", function(req, res){
	res.render("index-example", {episodesData});
});

app.get("/episodes/:id", function(req, res){
	var id = req.params.id;
	episode = episodesData[id-episodesData[0].id];
	res.render("details-example", {episode});
});



// error handling 
app.use(function(req, res, next){
	var err = new Error("page not Found!");
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next){
	res.status(err.status||500);
	res.send(err.message);
});

app.listen(port, function(){
	console.log("listening to port " + port);
});