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
    request = new Request('insert into Gra(id_czasu,tytul,platformy,kategoria,wydawca,tagi,podobne)\n' +
      'values ((select id_czasu from Data where dzien = @Day and miesiac = @Month and rok = @Year)\n' +
      ',@Title,@Platform,@Category,@Publisher,@Tags,@Similar);',
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
    request.addParameter('Title', TYPES.VarChar, game[index].title);
    request.addParameter('Platform', TYPES.VarChar, game[index].platform);
    request.addParameter('Category', TYPES.VarChar, game[index].category);
    request.addParameter('Publisher', TYPES.VarChar, game[index].publisher);
    request.addParameter('Tags', TYPES.VarChar, game[index].tags);
    request.addParameter('Similar', TYPES.VarChar, game[index].similar);

    // Execute SQL statement
    connection.execSql(request);
  },
  dataSuper: function rec(game, index) {
    request = new Request('if not exists (select * from Data where dzien = @Day and miesiac = @Month and rok = @Year )\n' +
      'begin\n' +
      'insert into Data (dzien,miesiac,rok) values (@Day,@Month,@Year)\n' +
      'end;',
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
