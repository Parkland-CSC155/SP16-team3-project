var express= require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send("hello World");
});

router.get('/search', function (req,res) {
    var model = {
        id: req.params.id
    };
    
     res.render('search/:id', { model: model })
})



router.get('/list', function(req, res) {
    res.send("hello World");
});

module.exports = router;
