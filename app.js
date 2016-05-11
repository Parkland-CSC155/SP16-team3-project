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
		if(value != username){
            console.err("Invalid Username or Password");
        }
        else if (recordset.password != password){
            console.err("Invalid Username or Password")
        }
        console.log(recordset);
	}).catch(function(err) {
		 
	});
});



// passport.serializeUser(function(user, cb) {
//     cb(null, user.id);
// });

// passport.deserializeUser(function(id, cb) {
//     db.users.findById(id, function(err, user) {
//         if (err) { return cb(err); }
//         cb(null, user);
//     });
// });



// app.use(require('morgan')('dev'));
// app.use(require('cookie-parser')());
// app.use(require('body-parser').urlencoded({ extended: true }));
// app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));






app.get('/',
    function(req, res) {
        res.render('/list', { user: req.user });
    });

app.get('/logout',
    function(req, res) {
        if(req.user){
            console.log(req.user.username + " logged out");
            req.logout();
        }
        res.redirect('/');
    });

app.use('/api', require('./routes/api'));
app.use('/calc', require('./routes/calc'));
app.use('/login', require('./routes/login'))
//app.use(express.static(path.join(__dirname, 'public/js')));
app.use(express.static('public'));


var calc = require('./routes/calc');
var connectionString = "Driver={tedious};Server=tcp:nutritiondbserver.database.windows.net,1433;Database=nutritionDb;Uid=team3@nutritiondbserver;Pwd={CSC155final};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=3000";
var sqlConnection = new sql.connect(connectionString).then(function(){
    calc.funcBuild();
})
.catch(function (err) {
    console.log(err);
    next(err);
});


module.exports.sqlConnection = sqlConnection;
app.listen(port, function() {
    console.log("listening to port " + port);
});