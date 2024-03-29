var express = require('express');
var router = express.Router();

var path = require('path');
var sql = require('mssql');
//var db = new sqlite3.Database(path.resolve("./nutrition.db"));
var connectionString = "Driver={tedious};Server=tcp:nutritiondbserver.database.windows.net,1433;Database=nutritionDb;Uid=team3@nutritiondbserver;Pwd={CSC155final};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=3000";

var bodyParser = require('body-parser');

var nutritionList = [];

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
var nutritionList = [];

const APIKEY = "apiFinal155";
// validate all requests to the /api -based routes
router.use(function(req, res, next) {

    if (req.baseUrl !== "/api") {
        next();
        return;
    }


    var reqApiKey = req.query.apiKey

    if (!reqApiKey) {
        res.status(401);
        res.send("Missing API Key");
        return;
    }

    if (reqApiKey !== APIKEY) {
        res.status(401);
        res.send("Invalid API Key");
        return;
    }


    next();
});


router.get('/list', function(req, res) {

    var page = req.query.page || 1
    var searchText = req.params.searchText;

    var skip = (page - 1) * 25;

    var sqlReq = 'SELECT * FROM NutritionData ORDER BY shrt_desc DESC LIMIT 25 OFFSET '+skip;

    //sql.connect(connectionString).then(function() {
        var request = new sql.Request();
        request.query(sqlReq, function(err, records) {
            if (err) {
                throw (err);
            }


            recordset.forEach(function(row) {
                nutritionList.push(row['Shrt_Desc']);
                nutritionList.push(row['Water_(g)']);
                nutritionList.push(row['Energy_(Kcal)']);
                nutritionList.push(row['Protein_(g)']);
                nutritionList.push(row['Sugar_(g)']);
                nutritionList.push(row['Sodium_(mg']);
                nutritionList.push(row['Cholesterol_(mg)']);
                nutritionList.push(row['Carbohydrate_(g)']);

            });
            res.json(nutritionList);
        })

    //})
    //    .catch(function(err) {
    //        console.log(err);
    //        next(err);
    //    });

});




router.get("/search/:searchText", function(req, res, next) {

    var page = req.query.page || 1
    var searchText = req.params.searchText;

    var skip = (page - 1) * 25;

    var sqlReq = 'SELECT * FROM NutritionData WHERE shrt_desc LIKE '+searchText+' ORDER BY shrt_desc DESC LIMIT 25 OFFSET '+skip;

    //sql.connect(connectionString).then(function() {
        var request = new sql.Request();
        request.query(sqlReq, function(err, recordsets) {
            if (err) {
                throw (err);
            }
            recordset.forEach(function(row) {
                nutritionList.push(row['Shrt_Desc']);
                nutritionList.push(row['Water_(g)']);
                nutritionList.push(row['Energy_(Kcal)']);
                nutritionList.push(row['Protein_(g)']);
                nutritionList.push(row['Sugar_(g)']);
                nutritionList.push(row['Sodium_(mg']);
                nutritionList.push(row['Cholesterol_(mg)']);
                nutritionList.push(row['Carbohydrate_(g)']);

            });
            res.json(nutritionList);
        })

    //})
    //    .catch(function(err) {
    //        console.log(err);
    //        next(err);
    //    });

});

router.get("/details/:id", function(req, res, next) {


   
    var id = req.params.id;

    var sqlReq = 'SELECT * FROM NutritionDataWHERE id LIKE '+id;

    //sql.connect(connectionString).then(function() {
        var request = new sql.Request();
        request.query(sqlReq, function(err, recordsets) {
            if (err) {
                throw (err);
            }
            
                nutritionList.push(row['Shrt_Desc']);
                nutritionList.push(row['Water_(g)']);
                nutritionList.push(row['Energy_(Kcal)']);
                nutritionList.push(row['Protein_(g)']);
                nutritionList.push(row['Sugar_(g)']);
                nutritionList.push(row['Sodium_(mg']);
                nutritionList.push(row['Cholesterol_(mg)']);
                nutritionList.push(row['Carbohydrate_(g)']);

            
            res.json(nutritionList);
        })

    //})
    //    .catch(function(err) {
    //        console.log(err);
    //        next(err);
    //    });

});


module.exports = router;
