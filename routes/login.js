var express = require('express');
var router = express.Router();
var path = require('path');
var sql = require('mssql');
var bodyParser = require('body-parser');



// GET: /login
router.get('/login', function(req, res){
	res.render("login");
});

router.post('/login', function (req, res) {
passport.use(new Strategy(
    function(username, password, cb) {
        sql.users.findByUsername(username, function(err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.password != password) { return cb(null, false); }
            return cb(null, user);
        });
    }));	
	res.redirect('/');
	
});

router.get('/logout', function (req, res) {
  req.logout();  
  res.redirect('/');
});


// sql.connect(connection).then(function(){
//     new sql.Request().query(`select * from users  where username = ${value}`).then(function(recordset) {
// 		console.log(recordset);
// 	}).catch(function(err) {
		 
// 	});
// });




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


// app.use(passport.initialize());
// app.use(passport.session());


module.exports = router; 