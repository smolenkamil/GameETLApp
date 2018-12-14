var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var async = require('async');
var consolex = require('../routes/console-writer')



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


function encyklopedia(game,game_index){
  request = new Request(
    'if not exists (select * from Encyklopedia_Gier where id_gry = (select id_gry from Gra where tytul = @Title and producent = @Producer and platformy = @Platform and kategoria = @Category and wydawca = @Publisher and srednia_ocen = @Value and ilosc_ocen = @Quantity) \n' +
    ' and id_czasu_premiery = (select id_czasu_premiery from Data_premiery where dzien = @Day and miesiac = @Month and rok = @Year)\n' +
    ' and id_wym = (select id_wym from Wymagania_sprzetowe where rekomendowane = @Recommended and minimalne = @Minimal)\n' +
    ' and id_lapki = (select id_lapki from Lapki where w_gore = @Up and w_dol = @Down) )\n' +
    'begin\n' +
    '\n' +
    'insert into Encyklopedia_Gier(id_gry,id_czasu_premiery,id_wym,id_lapki)\n' +
    '    values ((select id_gry from Gra where tytul = @Title and producent = @Producer and platformy = @Platform and kategoria = @Category and wydawca = @Publisher and srednia_ocen = @Value and ilosc_ocen = @Quantity)\n' +
    '    ,(select id_czasu_premiery from Data_premiery where dzien = @Day and miesiac = @Month and rok = @Year)\n' +
    '    ,(select id_wym from Wymagania_sprzetowe where rekomendowane = @Recommended and minimalne = @Minimal)\n' +
    '    ,(select id_lapki from Lapki where w_gore = @Up and w_dol = @Down))\n' +
    'end;',
    function (err, rowCount, rows)  {
      if (err) {
        console.log(err);
      } else {
        if(game_index >= game.length-1) {
          consolex.showTxt("-- loading data to database "+game.length+"/"+game.length+" !")
          console.log("HAPPY END")
          start(game,game_index)
        }
        else {
          consolex.showTxt("-- loading data to database "+(game_index+1)+"/"+game.length+" !")
          console.log(game_index+" ENCYKLOPEDIA")
          game_index++
          start(game,game_index)
        }
      }
    });


  request.addParameter('Title', TYPES.VarChar, game[game_index].title);
  request.addParameter('Producer', TYPES.VarChar, game[game_index].producer);
  request.addParameter('Platform', TYPES.VarChar, game[game_index].platform);
  request.addParameter('Category', TYPES.VarChar, game[game_index].category);
  request.addParameter('Publisher', TYPES.VarChar, game[game_index].publisher);
  request.addParameter('Value', TYPES.Float, game[game_index].rating.value);
  request.addParameter('Quantity', TYPES.Int, game[game_index].rating.quantity);
  request.addParameter('Day', TYPES.Int, game[game_index].date.day);
  request.addParameter('Month', TYPES.Int, game[game_index].date.month);
  request.addParameter('Year', TYPES.Int, game[game_index].date.year);
  request.addParameter('Recommended', TYPES.VarChar, game[game_index].hardware_req.recommended);
  request.addParameter('Minimal', TYPES.VarChar, game[game_index].hardware_req.minimal);
  request.addParameter('Up', TYPES.Int, game[game_index].thumbs.up);
  request.addParameter('Down', TYPES.Int, game[game_index].thumbs.down);


  // Execute SQL statement
  connection.execSql(request);
}


function gra_tagi(game,game_index, index_taga) {
  request = new Request(
    'if not exists (select * from Gra_tagi where id_gry = (select id_gry from Gra where tytul = @Title and producent = @Producer and platformy = @Platform and kategoria = @Category and wydawca = @Publisher and srednia_ocen = @Value and ilosc_ocen = @Quantity) and id_tagi = (select id_tagi from Tagi where tagi = @Tag))\n' +
    'begin\n' +
    'insert into Gra_tagi(id_gry,id_tagi)\n' +
    'values ((select id_gry from Gra where tytul = @Title and producent = @Producer and platformy = @Platform and kategoria = @Category and wydawca = @Publisher and srednia_ocen = @Value and ilosc_ocen = @Quantity),\n' +
    '(select id_tagi from Tagi where tagi = @Tag))\n' +
    'end;',
    function (err, rowCount, rows)  {
      if (err) {
        console.log(err);
      } else {
        if(index_taga >= game[game_index].tags.length-1)   {
          console.log(game_index+" GRA_TAGI")
          encyklopedia(game,game_index)
        }
        else {
          index_taga++
          gra_tagi(game,game_index, index_taga)
        }
      }
    });

  request.addParameter('Title', TYPES.VarChar, game[game_index].title);
  request.addParameter('Producer', TYPES.VarChar, game[game_index].producer);
  request.addParameter('Platform', TYPES.VarChar, game[game_index].platform);
  request.addParameter('Category', TYPES.VarChar, game[game_index].category);
  request.addParameter('Publisher', TYPES.VarChar, game[game_index].publisher);
  request.addParameter('Value', TYPES.Float, game[game_index].rating.value);
  request.addParameter('Quantity', TYPES.Int, game[game_index].rating.quantity);
  request.addParameter('Tag', TYPES.VarChar, game[game_index].tags[index_taga]);

  // Execute SQL statement
  connection.execSql(request);
}



function gra_podobne(game,game_index, index_podobnego) {
  request = new Request(
    'if not exists (select * from Gra_podobne where id_gry = (select id_gry from Gra where tytul = @Title and producent = @Producer and platformy = @Platform and kategoria = @Category and wydawca = @Publisher and srednia_ocen = @Value and ilosc_ocen = @Quantity) and id_podobne = (select id_podobne from Podobne where podobne = @Similar))\n' +
    'begin\n' +
    'insert into Gra_podobne(id_gry,id_podobne)\n' +
    'values ((select id_gry from Gra where tytul = @Title and producent = @Producer and platformy = @Platform and kategoria = @Category and wydawca = @Publisher and srednia_ocen = @Value and ilosc_ocen = @Quantity)\n' +
    ',(select id_podobne from Podobne where podobne = @Similar))\n' +
    'end;',
    function (err, rowCount, rows)  {
      if (err) {
        console.log(err);
      } else {
        if(index_podobnego >= game[game_index].similar.length-1)    {
          console.log(game_index+" GRA_PODOBNE")
          gra_tagi(game,game_index,0)
        }
        else {
          index_podobnego++
          gra_podobne(game,game_index, index_podobnego)
        }
      }
    });

  request.addParameter('Title', TYPES.VarChar, game[game_index].title);
  request.addParameter('Producer', TYPES.VarChar, game[game_index].producer);
  request.addParameter('Platform', TYPES.VarChar, game[game_index].platform);
  request.addParameter('Category', TYPES.VarChar, game[game_index].category);
  request.addParameter('Publisher', TYPES.VarChar, game[game_index].publisher);
  request.addParameter('Value', TYPES.Float, game[game_index].rating.value);
  request.addParameter('Quantity', TYPES.Int, game[game_index].rating.quantity);
  request.addParameter('Similar', TYPES.VarChar, game[game_index].similar[index_podobnego]);

  // Execute SQL statement
  connection.execSql(request);
}




function podobne(game,game_index, index_podobnego) {
  request = new Request(
    'if not exists (select id_podobne from Podobne where podobne = @Similar)\n' +
    'begin\n' +
    'insert into Podobne(podobne)  values (@Similar)\n' +
    'end;',
    function (err, rowCount, rows)  {
      if (err) {
        console.log(err);
      } else {
        if(index_podobnego >= game[game_index].similar.length-1)   {
          console.log(game_index+" PODOBNE")
          gra_podobne(game,game_index,0)
        }
        else {
          index_podobnego++
          podobne(game,game_index, index_podobnego)
        }
      }
    });
  request.addParameter('Similar', TYPES.VarChar, game[game_index].similar[index_podobnego]);

  // Execute SQL statement
  connection.execSql(request);
}




function tagi(game,game_index, index_taga) {
  request = new Request('if not exists (select id_tagi from Tagi where tagi = @Tag)\n' +
    'begin\n' +
    'insert into Tagi(tagi)  values (@Tag)\n' +
    'end;',
    function (err, rowCount, rows)  {
      if (err) {
        console.log(err);
      } else {
        if(index_taga >= game[game_index].tags.length-1)  {
          console.log(game_index+" TAGI")
          podobne(game,game_index, 0);
        }
        else {
          index_taga++
          tagi(game,game_index, index_taga)
        }
      }
    });
  request.addParameter('Tag', TYPES.VarChar, game[game_index].tags[index_taga]);

  // Execute SQL statement
  connection.execSql(request);
}




function lapki(game,game_index) {
  request = new Request('if not exists (select id_lapki from Lapki where w_gore = @Up and w_dol = @Down)\n' +
    'begin\n' +
    'insert into Lapki(w_gore,w_dol)  values (@Up,@Down)\n' +
    'end;',
    function (err, rowCount, rows)  {
      if (err) {
        console.log(err);
      } else {
        console.log(game_index+" LAPKI")
        tagi(game,game_index, 0);
      }
    });
  request.addParameter('Up', TYPES.Int, game[game_index].thumbs.up);
  request.addParameter('Down', TYPES.Int, game[game_index].thumbs.down);

  // Execute SQL statement
  connection.execSql(request);

}



function wymagania_sprzetowe(game,game_index){
  request = new Request(
    'if not exists (select id_wym from Wymagania_sprzetowe where rekomendowane = @Recommended and minimalne = @Minimal)\n' +
    'begin\n' +
    'insert into Wymagania_sprzetowe(rekomendowane,minimalne) values (@Recommended,@Minimal);\n' +
    'end',
    function (err, rowCount, rows)  {
      if (err) {
        console.log(err);
      } else {
        console.log(game_index+" WYMAGANIA")
        lapki(game,game_index);
      }
    });
  request.addParameter('Recommended', TYPES.VarChar, game[game_index].hardware_req.recommended);
  request.addParameter('Minimal', TYPES.VarChar, game[game_index].hardware_req.minimal);

  // Execute SQL statement
  connection.execSql(request);
}



function posty(game,game_index,index_posta){
  var check = game[game_index].comments.length>0
  if(!check) {
    wymagania_sprzetowe(game,game_index);
    return
  }
  request = new Request('if not exists (select id_posta from Posty where login = @Login and ranga = @Rank and stopien = @Degree and tresc = @Contents)\n' +
    'begin\n' +
    'insert into Posty(id_gry,id_czasu_posta,login,ranga,stopien,tresc)  \n' +
    'values ((select id_gry from Gra where tytul = @Title and producent = @Producer and platformy = @Platform and kategoria = @Category and wydawca = @Publisher and srednia_ocen = @Value and ilosc_ocen = @Quantity)\n' +
    ',(select id_czasu_posta from Data_posta where dzien = @Day and miesiac = @Month and rok = @Year and godzina = @Hour and minuta = @Minute)\n' +
    ',@Login,@Rank,@Degree,@Contents);\n' +
    'end',
    function (err, rowCount, rows)  {
      if (err) {
        console.log(err);
      } else {
        if(index_posta >= game[game_index].comments.length-1) {
          console.log(game_index+" POSTY")
          wymagania_sprzetowe(game,game_index);
        }
        else {
          index_posta++
          posty(game,game_index, index_posta)
        }
      }
    });
  request.addParameter('Title', TYPES.VarChar, game[game_index].title);
  request.addParameter('Producer', TYPES.VarChar, game[game_index].producer);
  request.addParameter('Platform', TYPES.VarChar, game[game_index].platform);
  request.addParameter('Category', TYPES.VarChar, game[game_index].category);
  request.addParameter('Publisher', TYPES.VarChar, game[game_index].publisher);
  request.addParameter('Value', TYPES.Float, game[game_index].rating.value);
  request.addParameter('Quantity', TYPES.Int, game[game_index].rating.quantity);
  request.addParameter('Day', TYPES.Int, check ? game[game_index].comments[index_posta].date.day : null);
  request.addParameter('Month', TYPES.Int, check ? game[game_index].comments[index_posta].date.month : null);
  request.addParameter('Year', TYPES.Int, check ? game[game_index].comments[index_posta].date.year : null);
  request.addParameter('Hour', TYPES.Int, check ? game[game_index].comments[index_posta].date.hour : null);
  request.addParameter('Minute', TYPES.Int, check ? game[game_index].comments[index_posta].date.minute : null);
  request.addParameter('Login', TYPES.VarChar, check ? game[game_index].comments[index_posta].login : null);
  request.addParameter('Rank', TYPES.Int, check ? game[game_index].comments[index_posta].rank : null);
  request.addParameter('Degree', TYPES.VarChar, check ? game[game_index].comments[index_posta].degree : null);
  request.addParameter('Contents', TYPES.VarChar, check ? game[game_index].comments[index_posta].contents : null);

  // Execute SQL statement
  connection.execSql(request);

}




function gra(game,game_index){
  request = new Request('if not exists (select id_gry from Gra where tytul = @Title and producent = @Producer and platformy = @Platform and kategoria = @Category and wydawca = @Publisher and srednia_ocen = @Value and ilosc_ocen = @Quantity) \n' +
    'begin ' +
    'insert into Gra(tytul,producent,platformy,kategoria,wydawca,srednia_ocen,ilosc_ocen) \n' +
    'values (@Title,@Producer,@Platform,@Category,@Publisher,@Value,@Quantity) ' +
    'end;',
    function (err, rowCount, rows)  {
      if (err) {
        console.log(err);
      } else {
        console.log(game_index+" GRA")
        posty(game,game_index, 0)
        // console.log("Good!")
      }
    });
  // request.addParameter('Day', TYPES.Int, game.date.day);
  // request.addParameter('Month', TYPES.Int, game.date.month);
  // request.addParameter('Year', TYPES.Int, game.date.year);
  request.addParameter('Title', TYPES.VarChar, game[game_index].title);
  request.addParameter('Producer', TYPES.VarChar, game[game_index].producer);
  request.addParameter('Platform', TYPES.VarChar, game[game_index].platform);
  request.addParameter('Category', TYPES.VarChar, game[game_index].category);
  request.addParameter('Publisher', TYPES.VarChar, game[game_index].publisher);
  request.addParameter('Value', TYPES.Float, game[game_index].rating.value);
  request.addParameter('Quantity', TYPES.Int, game[game_index].rating.quantity);

  // Execute SQL statement
  connection.execSql(request);
}



function data_posta(game,game_index, index_posta){
  var check = game[game_index].comments.length>0
  if(!check) {
    gra(game,game_index);
    return
  }
  request = new Request('' +
    'if not exists (select * from Data_posta where dzien = @Day and miesiac = @Month and rok = @Year and godzina = @Hour and minuta = @Minute)\n' +
    'begin\n' +
    'insert into Data_posta (dzien,miesiac,rok,godzina,minuta) values (@Day,@Month,@Year,@Hour,@Minute)\n' +
    'end;',
    function (err, rowCount, rows)  {
      if (err) {
        console.log(err);
      } else {
        if(index_posta >= game[game_index].comments.length-1) {
          console.log(game_index+" DATA POSTA")
          gra(game,game_index);
        }
        else {
          index_posta++
          data_posta(game,game_index, index_posta)
        }
      }
    });
  request.addParameter('Day', TYPES.Int, check ? game[game_index].comments[index_posta].date.day : null);
  request.addParameter('Month', TYPES.Int, check ? game[game_index].comments[index_posta].date.month : null);
  request.addParameter('Year', TYPES.Int, check ? game[game_index].comments[index_posta].date.year : null);
  request.addParameter('Hour', TYPES.Int, check ? game[game_index].comments[index_posta].date.hour : null);
  request.addParameter('Minute', TYPES.Int, check ? game[game_index].comments[index_posta].date.minute : null);

  // Execute SQL statement
  connection.execSql(request);
}
var finished = false

var start = function dataPremiery(game, game_index) {
    if(game_index >= game.length-1) {
      consolex.showTxt("  |LOAD - END|")
      finished = true
      module.exports.finish = finished
      return
    }
    request = new Request('if not exists (select * from Data_premiery where dzien = @Day and miesiac = @Month and rok = @Year)\n' +
      'begin\n' +
      'insert into Data_premiery (dzien,miesiac,rok) values (@Day,@Month,@Year)\n' +
      'end;',
      function (err, rowCount, rows) {
        if (err) {
          console.log(err);
        } else {
          console.log(game_index + " DATA PREMIERY")
          data_posta(game, game_index, 0)

        }
      });
    request.addParameter('Day', TYPES.Int, game[game_index].date.day || null);
    request.addParameter('Month', TYPES.Int, game[game_index].date.month || null);
    request.addParameter('Year', TYPES.Int, game[game_index].date.year || null);

    // Execute SQL statement
    connection.execSql(request);
  }


module.exports = {
  insert: start,
  finish: finished
}
