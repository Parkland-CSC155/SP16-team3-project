var express= require('express');
var router = express.Router();

router.get('/list', function(req, res) {
    res.render("api/list", {model: model});
});

router.get('/api/:id', function (req,res) {
    var model = {
        id: req.params.id
    };
    
     res.render('api/preview', { model: model })
})



// router.get("/search/:searchText", function(req, res, next){
//     var page = req.query.page || 1
//     var searchText = req.params.searchText;
    
//     var skip = (page -1) *25;
    
//     var sql = `
//     SELECT * 
//     FROM NutritionDB
//     WHERE shrt_desc LIKE '${searchText}'
//     LIMIT 25 OFFSET ${skip}
//     `;
    
//     db.all(sql, function(err, records){
//         if(err){
//             next(err);
//         }
        
//     })
    
//     res.json()
    
// });



module.exports = router;
