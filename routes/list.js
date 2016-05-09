var express= require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var path = require('path');
//TODO: convert to mssql
//var mssql = require('mssql');
var db = new sqlite3.Database(path.resolve("./nutrition.db"));
//var session = require('express-session');
//var connectionString = process.env.MS_TableConnectionString;

// route
app.get("/list", function(req, res){

  var page = req.query.page || 1;
  page = Number(page); // in case it is a string, we need it to be a number

  // database querying logic

  res.render('list', {
    // other data 
    page: page // pass what page we're on to the view
  });

});

var listview = // listview variable for the records?
`
SELECT SELECT Shrt_Desc 
FROM NutritionData
OFFSET 0
FETCH NEXT 25 ROWS ONLY
`;

// is it get or run?
db.get(listview, "", function(err,row){ // what do we put in parentheses? The name of the database?
    console.log(row); // change this to display on the page ???
});


// Navigation for Previous, next pages, and Next
<a href="/list?page=<%= (page - 1) %>">Prev</a>

<a href="/list?<%= (page - 2) %>"><%= (page - 2) %></a>
<a href="/list?<%= (page - 1) %>"><%= (page - 1) %></a>
<a href="/list?<%= (page + 1) %>"><%= (page + 1) %></a>
<a href="/list?<%= (page + 2) %>"><%= (page + 2) %></a>

<a href="/list?<%= (page + 1) %>">Next</a>

// need to render the webpage???

module.exports = router;