var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
var sql = require('mssql');
// var db = new sqlite3.Database(path.resolve("./nutrition.db"));
var session = require('express-session');
var connectionString = "Driver={tedious};Server=tcp:nutritiondbserver.database.windows.net,1433;Database=nutritionDb;Uid=team3@nutritiondbserver;Pwd={CSC155final};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=3000";




var nutritionList = [];
router.post("/post", function(req, res, next){
    var input = req.body.input;
    console.log(input);
    db.get('SELECT * FROM NutritionData where Shrt_Desc = ?', [input], function(err, row) {
        if(err)
            throw err;
        if(typeof row!='undefined'){
            // check if the row already exists
        }
        res.redirect("/search");
    });
});


router.get('/', function(req, res) {

    var page = req.query.page || 1
    var searchText = req.params.searchText;

    var skip = (page - 1) * 25;

    var sqlReq = 'SELECT * FROM NutritionData ORDER BY shrt_desc OFFSET '+skip+" ROWS FETCH NEXT 25 ROWS ONLY";
    console.log(sqlReq);
    //sql.connect(connectionString).then(function() {
    var list = [];
    var request = new sql.Request();
    request.query(sqlReq, function(err, recordset) {
        if (err) {
            throw (err);
        }

        recordset.forEach(function(row) {
            //nutritionList.push({name:row['Shrt_Desc'],water:row['Water_(g)'],energy:row['Energ_Kcal'],protein:row['Protein_(g)'],
            //    sugar:row['Sugar_Tot_(g)'], sodium:row['Sodium_(mg)'],cholesterol:row['Cholestrl_(mg)'],carbohydrate:row['Carbohydrt_(g)'],
            //    id:row['NDO_No']});
            list.push({name:row['Shrt_Desc'],water:row['Water_(g)'],energy:row['Energ_Kcal'],protein:row['Protein_(g)'],
                    sugar:row['Sugar_Tot_(g)'], sodium:row['Sodium_(mg)'],cholesterol:row['Cholestrl_(mg)'],carbohydrate:row['Carbohydrt_(g)'],
                    id:row['NDB_No']});
        });
        if(req.user)
            res.render("list",{page:page, foodList:list});
        else
            res.redirect("login");
    })

    //})
    //    .catch(function(err) {
    //        console.log(err);
    //        next(err);
    //    });

});




router.get("/search/:searchText", function(req, res, next) {

    var page = req.query.page || 1;
    var searchText = req.params.searchText;

    var skip = (page - 1) * 25;

    var sqlReq = 'SELECT * FROM NutritionData WHERE shrt_desc LIKE '+searchText+' ORDER BY shrt_desc 25 OFFSET '+skip+" ROWS FETCH NEXT 25 ROWS ONLY";

    //sql.connect(connectionString).then(function() {
    var request = new sql.Request();
    request.query(sqlReq, function(err, recordsets) {
        if (err) {
            throw (err);
        }
        nutritionList.push({name:row['Shrt_Desc'],water:row['Water_(g)'],energy:row['Energ_Kcal'],protein:row['Protein_(g)'],
            sugar:row['Sugar_Tot_(g)'], sodium:row['Sodium_(mg)'],cholesterol:row['Cholestrl_(mg)'],carbohydrate:row['Carbohydrt_(g)'],
            id:row['NDB_No']});

    });
    res.send({foodList:JSON.stringify(nutritionList)});
    res.render("/search/{id}");
});

//})
//    .catch(function(err) {
//        console.log(err);
//        next(err);
//    });

//});

router.get("/details/:id", function(req, res, next) {

    var id = req.params.id;

    var sqlReq = 'SELECT * FROM NutritionData WHERE NDB_No ='+id;

    //sql.connect(connectionString).then(function() {
    var request = new sql.Request();
    var ret;
    request.query(sqlReq, function(err, recordsets) {
        if (err) {
            throw (err);
        }

        //nutritionList.push(row['Shrt_Desc']);
        //nutritionList.push(row['Water_(g)']);
        //nutritionList.push(row['Energy_(Kcal)']);
        //nutritionList.push(row['Protein_(g)']);
        //nutritionList.push(row['Sugar_(g)']);
        //nutritionList.push(row['Sodium_(mg']);
        //nutritionList.push(row['Cholesterol_(mg)']);
        //nutritionList.push(row['Carbohydrate_(g)']);
        //nutritionList.push(row['NDB_No']);
        row = recordsets[0];
        ret =row;

        //res.send({foodList:JSON.stringify(nutritionList)});
        if(req.user)
            res.render("details",{foodList:ret});
        else
            res.redirect("login");
    })

    //})
    //    .catch(function(err) {
    //        console.log(err);
    //        next(err);
    //    });

});

// // route
// app.get("/list", function (req, res) {

//     var page = req.query.page || 1;
//     page = Number(page); // in case it is a string, we need it to be a number


//     router.get("/search/:searchText", function (req, res, next) {
//         var page = req.query.page || 1
//         var searchText = req.params.searchText;

//         var skip = (page - 1) * 25;

//         var sql = `
//     SELECT * 
//     FROM NutritionData
//     WHERE shrt_desc LIKE '${searchText}'
//     LIMIT 25 OFFSET ${skip}
//     `;

//         db.all(sql, function (err, records) {
//             if (err) {
//                 next(err);
//             }

//         })

//         res.render('list', {
//             data: food, 
//             page: page
//         });

//     });

// });


module.exports = router;


