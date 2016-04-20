
var express = require('express');
var app = express();
var routes;
var path = require('path');
var port = process.env.PORT||3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(function(req, res, next){
	console.log('requiest!!');
	var log = "request url:" + req.url;
	console.log(log);
	next();
});
app.get("/", function(req, res, next){
	res.send('GET\'EM!');
});

app.get("/nutrition/:id", function(req, res){
	var id = req.params.id;
	var data = /* query db*/{id:id};
	var page = req.query.page;
	res.send(data);
});


app.get("/my-page", function(req, res){
	res.render('index', name{})
});






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