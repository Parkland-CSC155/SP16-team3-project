var express= require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var conn = require('../app');

var sql = require('mssql');
var db = new sqlite3.Database(path.resolve("./nutrition.db"));
//var session = require('express-session');
//var connectionString = "Driver={SQL Server Native Client 11.0};Server=tcp:nutritiondbserver.database.windows.net,1433;Database=nutritionDb;Uid=team3@nutritiondbserver;Pwd={CSC155final};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30";
var connectionString = "Driver={tedious};Server=tcp:nutritiondbserver.database.windows.net,1433;Database=nutritionDb;Uid=team3@nutritiondbserver;Pwd={CSC155final};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=3000";

//var seq = new Sequelize(connectionString,{dialect:'mssql'});

var nutritionList = [];
var calcList = {};
var total = {}

var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
//-----------------------------sqlite3 version------------------------------------------------------------------
// //TODO: add support for changing quantity. Currently adding a dup item overwrite the old value. UPDATE: partially done, still need to take care of the case where quant goes negative.
// //TODO: arithmetic operations on total are not applicable to text fields (e.g. shrt_desc)(current solution: using isNaN() to check)
// //TODO: remove the need for refresh after post
// router.post("/post", function(req, res, next){
//     var input = req.body.input;
//     var quant = req.body.quant;
//     console.log(input);
//     db.get('SELECT * FROM NutritionData where Shrt_Desc = ?', [input], function(err, row) {
//         if(err)
//             throw err;
//         if(typeof row!='undefined'){
//             // check if the row already exists
//             if(!calcList.hasOwnProperty(row.NDB_No)){
//                 calcList[row.NDB_No] = row;
//                 calcList[row.NDB_No]['quant'] = quant;
//             }
//             else{
//                 // making it string so that quant is excluded in calculating total
//                 calcList[row.NDB_No]['quant']=String(Number(calcList[row.NDB_No]['quant'])+Number(quant));
//             }
//             // add to total
//             for (var key in row) {
//                 if (row.hasOwnProperty(key)&& !isNaN(row[key])) {
//                     if(typeof total[key]=='undefined')
//                         total[key] = Number(row[key])*quant;
//                     else
//                         total[key] += Number(row[key])*quant;
//                 }
//             }
//         }
//         // send the user back to a confirmation page
//         res.redirect("/calc/");
//     });
// });
//
// router.post("/delete", function(req, res, next){
//     var id = req.body.deleteId;
//     console.log('delete '+id);
//     for (var key in total) {
//         if (total.hasOwnProperty(key) && !isNaN(total[key])) {
//             total[key] -= Number(calcList[id][key])*calcList[id]['quant'];
//         }
//     }
//     delete calcList[id];
//     res.redirect("/calc/");
// });
//
//// // init list of names for autocomplete
// db.each('SELECT Shrt_Desc FROM NutritionData', function(err, row) {
//     if(err)
//         throw err;
//     nutritionList.push(row.Shrt_Desc);
// });

router.get('/autocomplete', function(req, res) {
    res.send({ajaxList:JSON.stringify(nutritionList)});
});

//-----------------------mssql version------------------------------------------
//sql.connect(connectionString).then(function(){
// function to be exported so it can be called after connection is established in app.js
var funcBuild = function() {
    var request = new sql.Request();
    request.query('SELECT Shrt_Desc FROM NutritionData', function (err, recordset) {
        if (err)
            throw err;
        //console.log(recordset);
        recordset.forEach(function (row) {
            nutritionList.push(row['Shrt_Desc']);
        });
        console.log('list loaded');
    })
};
//})
//.catch(function (err) {
//    console.log(err);
//    next(err);
//});

router.post("/post", function(req, res, next){
    var input = req.body.input;
    var quant = req.body.quant;
    console.log(input);
    var ps = new sql.PreparedStatement();
    ps.input('inputValue', sql.NVarChar)
    ps.prepare('SELECT * FROM NutritionData where Shrt_Desc = @inputValue', function (err){
        if(err)
            throw err;
        else{
            ps.execute({inputValue:input}, function(err, row, affected) {
                if(err)
                    throw err;
                if(row.length>0){
                    row = row[0];
                    // check if the row already exists
                    if(!calcList.hasOwnProperty(row.NDB_No)){
                        calcList[row.NDB_No] = row;
                        calcList[row.NDB_No]['quant'] = quant;
                    }
                    else{
                        // making it string so that quant is excluded in calculating total
                        calcList[row.NDB_No]['quant']=String(Number(calcList[row.NDB_No]['quant'])+Number(quant));
                    }
                    // add to total
                    for (var key in row) {
                        if (row.hasOwnProperty(key)&& !isNaN(row[key])) {
                            if(typeof total[key]=='undefined')
                                total[key] = Number(row[key])*quant;
                            else
                                total[key] += Number(row[key])*quant;
                        }
                    }
                }
                // send the user back to a confirmation page
                res.redirect("/calc/");
                ps.unprepare(function(err){})
            });
        }
    });
});

router.post("/delete", function(req, res, next){
    var id = req.body.deleteId;
    console.log('delete '+id);

    for (var key in total) {
        if (total.hasOwnProperty(key) && !isNaN(total[key])) {
            total[key] -= Number(calcList[id][key])*calcList[id]['quant'];
        }
    }
    delete calcList[id];
    res.redirect("/calc/");
});

// Ignore this section
//-------------------------Sequelize version------------------------------------------------


// var seq = new Sequelize('nutritionDb','team3@nutritiondbserver','CSC155final',{
//     host: 'tcp:nutritiondbserver.database.windows.net,1433',
//     dialect: 'mssql',
//     Driver: 'SQL Server Native Client 11.0'
// });
// "Driver={SQL Server Native Client 11.0};Server=tcp:nutritiondbserver.database.windows.net,1433;
// Database=nutritionDb;Uid=team3@nutritiondbserver;Pwd={CSC155final};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=3000";



// Render webpage
router.get('/', function(req, res) {
    // No idea why using JSON.stringfy makes it work..
    //res.render('calculator', {nutritionList, calcList, total});
    // only accessible after logging in
    console.log("user: " + req.user);
    if(req.user)
        res.render('calculator', {nutritionList:JSON.stringify(nutritionList), calcList:calcList, total:total});
    else
        res.redirect('login')
});

module.exports = router;
module.exports.funcBuild = funcBuild;