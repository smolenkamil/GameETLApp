var express = require('express');
var router = express.Router();
var fs = require('fs');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var async = require('async');


// Create connection to database
var config = {
  userName: 'sa', // update me
  password: 'Qwerty-1', // update me
  server: 'localhost',
  options: {
    database: 'gameDB'
  }
}
var connection = new Connection(config);


router.get('/', function(req, res, next) {

  var iterator = 0
  var tables = [
    'Encyklopedia_Gier',
    'Data_premiery',
    'Lapki',
    'Wymagania_sprzetowe',
    'Gra_tagi',
    'Tagi',
    'Gra_podobne',
    'Podobne',
    'Posty',
    'Data_posta',
    'Gra',
  ]

  deleteFromTable(tables)
  function deleteFromTable(tableName){
    var composedRequest = 'DELETE FROM '+tableName[iterator]+';';
    request = new Request(composedRequest,
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          if(iterator >= tableName.length-1) {
            //
            res.json({deletion: "OK"})
            console.log("DELETION DONE!")
          }
          else {
            iterator++
            deleteFromTable(tableName)
          }
        }
      });

    // Execute SQL statement
    connection.execSql(request);
  }

});

module.exports = router;
