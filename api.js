var express = require('express');



router.get("/search/:searchText", function(req, res, next){
    var page = req.query.page || 1
    var searchText = req.params.searchText;
    
    var skip = (page -1) *25;
    
    var sql = `
    SELECT * 
    FROM NutritionDB
    WHERE shrt_desc LIKE '${searchText}'
    LIMIT 25 OFFSET ${skip}
    `;
    
    db.all(sql, function(err, records){
        if(err){
            next(err);
        }
        
    })
    
    res.json()
    
    
})