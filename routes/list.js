var express= require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var path = require('path');
//TODO: convert to mssql
//var mssql = require('mssql');
var db = new sqlite3.Database(path.resolve("./nutrition.db"));
//var session = require('express-session');
//var connectionString = process.env.MS_TableConnectionString;



module.exports = router;