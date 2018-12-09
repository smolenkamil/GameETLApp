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
  test: function rec(game, index) {
      request = new Request('INSERT INTO Data(dzien, miesiac, rok) VALUES (@Day, @Month, @Year);',
        function (err, rowCount, rows)  {
          if (err) {
            console.log(err);
          } else {
            if(index >= game.length-1) console.log(index + ' row(s) inserted to Data');
            else {
              index++
              rec(game, index)
            }
          }
        });
      request.addParameter('Day', TYPES.Int, game[index].date.day);
      request.addParameter('Month', TYPES.Int, game[index].date.month);
      request.addParameter('Year', TYPES.Int, game[index].date.year);

      // Execute SQL statement
      connection.execSql(request);
  }
}
