var express = require('express');
var fs = require('fs');
var app = express();
var path = require('path');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var port = process.env.PORT || 3000;
var sql = require('mssql');

var connection= "Driver={tedious};Server=tcp:nutritiondbserver.database.windows.net,1433;Database=nutritionDb;Uid=team3@nutritiondbserver;Pwd={your_password_here};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=3000;"


app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, 'views'));



sql.connect(connection).then(function(){
    new sql.Request().query(`select * from users  where username = ${value}`).then(function(recordset) {
		console.dir(recordset);
	}).catch(function(err) {
		 
	});
});
passport.use(new Strategy(
    function(username, password, cb) {
        db.users.findByUsername(username, function(err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.password != password) { return cb(null, false); }
            return cb(null, user);
        });
    }));



passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    db.users.findById(id, function(err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});



app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));


app.use(passport.initialize());
app.use(passport.session());


app.get('/',
    function(req, res) {
        res.render('login', { user: req.user });
    });

app.get('/login',
    function(req, res) {
        res.render('login');
    });

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout',
    function(req, res) {
        req.logout();
        res.redirect('/');
    });

app.use('/api', require('./routes/api'));
app.use('/calc', require('./routes/calc'));

//app.use(express.static(path.join(__dirname, 'public/js')));
app.use(express.static('public'));

app.listen(port, function() {
    console.log("listening to port " + port);
});