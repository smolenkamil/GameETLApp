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

module.exports = {
  insertx: function (game, id) {
    request = new Request('SET IDENTITY_INSERT tbl_content ON;' +
      'INSERT INTO GRA (id_gry,tytul, platformy, kategoria, wydawca, tagi, podobne) VALUES (@Id, @Title, @Platform, @Category, @Publisher, @Tags, @Similar);',
      function (err, rowCount, rows) {
        if (err) {
          console.log(err);
        } else {
          console.log(rowCount + ' row(s) inserted');
        }
      });
    request.addParameter('Id', TYPES.Int, id);
    request.addParameter('Title', TYPES.NVarChar, game.title);
    request.addParameter('Platform', TYPES.NVarChar, game.platform);
    request.addParameter('Category', TYPES.NVarChar, game.category);
    request.addParameter('Publisher', TYPES.NVarChar, game.publisher);
    request.addParameter('Tags', TYPES.NVarChar, " ");
    request.addParameter('Similar', TYPES.NVarChar, " ");

    // Execute SQL statement
    connection.execSql(request);
  },
  test: function (game) {
    request = new Request('INSERT INTO GRA (tytul, platformy, kategoria, wydawca, tagi, podobne) VALUES (@Title, @Platform, @Category, @Publisher, @Tags, @Similar);',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          console.log(rowCount + ' row(s) inserted');
        }
      });
    request.addParameter('Title', TYPES.NVarChar, game.title);
    request.addParameter('Platform', TYPES.NVarChar, game.platform);
    request.addParameter('Category', TYPES.NVarChar, game.category);
    request.addParameter('Publisher', TYPES.NVarChar, game.publisher);
    request.addParameter('Tags', TYPES.NVarChar, " ");
    request.addParameter('Similar', TYPES.NVarChar, " ");

    // Execute SQL statement
    connection.execSql(request);
  }


}
