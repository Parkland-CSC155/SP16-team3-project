var express= require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var db = new sqlite3.Database(path.resolve("./nutrition.db"));
var session = require('express-session');
var connectionString = process.env.MS_TableConnectionString;


var nutritionList = [];
var calcList = {};
var total = {}

var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

//TODO: add support for changing quantity. Currently adding a dup item overwrite the old value.
router.post("/post", function(req, res, next){
    var input = req.body.input;
    var quant = req.body.quant;
    console.log(input);
    db.get('SELECT * FROM NutritionData where Shrt_Desc = ?', [input], function(err, row) {
        if(err)
            throw err;
        if(typeof row!='undefined'){
            calcList[row.NDB_No] = row;
            calcList[row.NDB_No]['quant'] = quant;

            // add to total
            for (var key in row) {
                if (row.hasOwnProperty(key)) {
                    if(typeof total[key]=='undefined')
                        total[key] = Number(row[key])*quant;
                    else
                        total[key] += Number(row[key])*quant;
                }
            }
        }
        res.redirect("/calc/");
    });
    // send the user back to a confirmation page
});

router.post("/delete", function(req, res, next){
    var id = req.body.deleteId;
    console.log('delete '+id);
    for (var key in total) {
        if (total.hasOwnProperty(key)) {
            total[key] -= Number(calcList[id][key])*calcList[id]['quant'];
        }
    }
    delete calcList[id];
    res.redirect("/calc/");
});

// init list of names for autocomplete
db.each('SELECT Shrt_Desc FROM NutritionData', function(err, row) {
    if(err)
        throw err;
    nutritionList.push(row.Shrt_Desc);
});


router.get('/', function(req, res) {
    // No idea why using JSON.stringfy makes it work..
    res.render('calculator', {nutritionList:JSON.stringify(nutritionList), calcList, total});
    //res.render('experiment');
});

module.exports = router;