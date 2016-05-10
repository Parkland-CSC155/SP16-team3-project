var express = require('express');
var router = express.Router();
var path = require('path');
var sql = require('mssql');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
//var connectionString = "Driver={tedious};Server=tcp:nutritiondbserver.database.windows.net,1433;Database=nutritionDb;Uid=team3@nutritiondbserver;Pwd={CSC155final};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=3000";
//var globaluid = 0;

router.use(passport.initialize());
router.use(passport.session());

router.get('/', function(req, res){
    res.render("login");
});
passport.use(new Strategy(
    function(username, password, cb) {
        verifyUser(username, password, function(err, user) {
            if (err) { return cb(err); console.log("error");}
            if (!user) { console.log("no user found"); return cb(null, false); }
            //if (user.password != password) { return cb(null, false); }
            console.log(username + " login success");
            return cb(null, user);
        });
    }));


//router.post('/', function (req, res) {
//    var uname = req.body.username;
//    var pw = req.body.password;
//    console.log("login request received: user: " +uname+", password:"+pw);
//    passport.authenticate('local', { successRedirect: '/calc', failureRedirect: '/' });
//});

router.post('/',
    passport.authenticate('local', { successRedirect: '/calc',
        failureRedirect: '/login' }));

 passport.serializeUser(function(user, cb) {
     //user.id = globaluid++;
     cb(null, user.username+"-delim-"+user.password);
 });

 passport.deserializeUser(function(key, cb) {
     findUser(key, function(err, user) {
         if (err) { return cb(err); }
         cb(null, user);
     });
 });

// Connection now is established in app.js instead, also this section is for testing only.
//var conn = new sql.connect(connectionString).then(function(){
//        //var request = new sql.Request();
//        //    request.query('SELECT * FROM Users', function(err, recordset) {
//        //    if(err)
//        //        throw err;
//        //    //console.log(recordset);
//        //    recordset.forEach(function(row){
//        //        userdb.push(row);
//        //    });
//        //    console.log('userlist loaded');
//        //})
//
//    })
//    .catch(function (err) {
//        console.log(err);
//        next(err);
//    });

// Query the user table to check if login credentials are valid.
function verifyUser(name, password, cb){
    var ps = new sql.PreparedStatement();
    ps.input('inputName', sql.NVarChar)
    ps.input('inputPassword', sql.NVarChar)
    ps.prepare('SELECT * FROM Users where username = @inputName AND password = @inputPassword', function (err){
        if(err)
            throw err;
        else{
            ps.execute({inputName:name, inputPassword:password}, function(err, row, affected) {
                if(err)
                    throw err;
                if(row.length>0){
                    cb(null, row[0]);
                }
                else{
                    cb(null, null);
                }
                ps.unprepare(function(err){})
            });
        }
    });

}

function findUser(key, cb){
    var arr = key.split("-delim-");
    verifyUser(arr[0], arr[1], cb);
}


module.exports = router; 