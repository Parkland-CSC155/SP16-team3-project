var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var path = require('path');
//TODO: convert to mssql
var mssql = require('mssql');
var db = new sqlite3.Database(path.resolve("./nutrition.db"));
//var session = require('express-session');
var connectionString = process.env.MS_TableConnectionString;


// route
app.get("/list", function (req, res) {

    var page = req.query.page || 1;
    page = Number(page); // in case it is a string, we need it to be a number


    router.get("/search/:searchText", function (req, res, next) {
        var page = req.query.page || 1
        var searchText = req.params.searchText;

        var skip = (page - 1) * 25;

        var sql = `
    SELECT * 
    FROM NutritionData
    WHERE shrt_desc LIKE '${searchText}'
    LIMIT 25 OFFSET ${skip}
    `;

        db.all(sql, function (err, records) {
            if (err) {
                next(err);
            }

        })





        res.render('list', {
            // other data 
            page: page
        });

    });

});
module.exports = router;