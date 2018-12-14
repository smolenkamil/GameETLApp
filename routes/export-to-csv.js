var express = require('express');
var router = express.Router();
var fs = require('fs');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var async = require('async');
const Json2csvParser = require('json2csv').Parser;

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



/* GET home page. */
router.get('/comments', function(req, res, next) {
  posty()
  function posty() {
    var comments = []
    request = new Request('select * from Posty;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          data_posta(comments,0)
        }
      });
    request.on('row', function(columns) {
      var comment_template = {
        game_id: 0,
        date_id: 0,
        date: "",
        login: "",
        rank: "",
        degree: "",
        contents: ""
      }
      comment_template.game_id = columns[1].value;
      comment_template.date_id = columns[2].value;
      comment_template.login = columns[3].value;
      comment_template.rank = columns[4].value;
      comment_template.degree = columns[5].value;
      comment_template.contents = columns[6].value;
      comments.push(comment_template)
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function data_posta(comments, index_posta) {
    var check = comments.length>0
    if(!check) {
      res.json(comments);
      return
    }
    request = new Request('select dzien,miesiac,rok,godzina,minuta from Data_posta where id_czasu_posta = @DateId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          if(index_posta >= comments.length-1)  {
            finalizator(comments)
            res.json(comments);
          }
          else {
            index_posta++
            data_posta(comments,index_posta)
          }
        }
      });
    request.addParameter('DateId', TYPES.Int, comments[index_posta].date_id);
    request.on('row', function(columns) {
      comments[index_posta].date = columns[0].value+"."+columns[1].value+"."+columns[2].value +"  "+columns[3].value+":"+columns[4].value;
    });
    // Execute SQL statement
    connection.execSql(request);
  }

  function finalizator(comments){
    const fields = ['game_id', 'date_id', 'date', 'login','rank','degree','contents'];
    const opts = { fields };
    try {
      const parser = new Json2csvParser(opts);
      const csv = parser.parse(comments);
      fs.writeFile('./export/comments.csv', csv, function(err){
        console.log("super")
      })
    } catch (err) {
      console.error(err);
    }
  }


});

router.get('/all', function(req, res, next) {
  var count = 0
  var iterator = 1
  var games = []

  request = new Request('SELECT count(*) FROM Gra;',
    function (err, rowCount, rows)  {
      if (err) {
        console.log(err);
      } else {
        console.log("count: "+count)
        gra()
      }
    });
  request.on('row', function(columns) {
    count = columns[0].value
  });
  // Execute SQL statement
  connection.execSql(request);



  function gra() {

    var ids = {
      game_id: 0,
      similar_id: [],
      tags_id: [],
      date_id: 0,
      req_id:0,
      thumbs_id:0,
    }

    var obj = {
      game_id: 0,
      title: "",
      producer: "",
      platform: "",
      category: "",
      publisher: "",
      rating_value: 0,
      rating_quantity: 0,
      similar: "",
      tags:"",
      date: "",
      hardware_recommended:"",
      hardware_minimal: "",
      thumbs_up:0,
      thumbs_down:0
    }
    request = new Request('select * from Gra where id_gry = @GameId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          // res.json(obj);
          gra_podobne(obj,ids)
        }

      });
    request.addParameter('GameId', TYPES.Int, iterator);
    request.on('row', function(columns) {
      ids.game_id = columns[0].value
      obj.game_id = columns[0].value
      obj.title = columns[1].value
      obj.producer = columns[2].value
      obj.platform = columns[3].value
      obj.category= columns[4].value
      obj.publisher = columns[5].value
      obj.rating_value= columns[6].value
      obj.rating_quantity= columns[7].value
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function gra_podobne(game,ids) {
    request = new Request('select id_podobne from Gra_podobne where id_gry = @GameId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          podobne(game,ids,0)
        }

      });
    request.addParameter('GameId', TYPES.Int, ids.game_id);
    request.on('row', function(columns) {
      ids.similar_id.push(columns[0].value)
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function podobne(game,ids,index_podobne) {
    request = new Request('select podobne from Podobne where id_podobne = @SimilarId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          if(index_podobne >= ids.similar_id.length-1)  {
            gra_tagi(game,ids)
          }
          else {
            index_podobne++
            podobne(game,ids,index_podobne)
          }
        }

      });

    request.addParameter('SimilarId', TYPES.Int, ids.similar_id[index_podobne]);

    request.on('row', function(columns) {
      game.similar += columns[0].value+";"
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function gra_tagi(game,ids) {
    request = new Request('select id_tagi from Gra_tagi where id_gry = @GameId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          tagi(game,ids,0)
        }
      });
    request.addParameter('GameId', TYPES.Int, ids.game_id);
    request.on('row', function(columns) {
      ids.tags_id.push(columns[0].value)
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function tagi(game,ids,index_tag) {
    request = new Request('select tagi from Tagi where id_tagi = @TagId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          if(index_tag >= ids.tags_id.length-1)  {
            encyklopedia(game,ids)
          }
          else {
            index_tag++
            tagi(game,ids,index_tag)
          }
        }

      });
    request.addParameter('TagId', TYPES.Int, ids.tags_id[index_tag]);
    request.on('row', function(columns) {
      game.tags += columns[0].value+";"
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function encyklopedia(game,ids) {
    request = new Request('select * from Encyklopedia_Gier where id_gry = @GameId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          data_premiery(game,ids)
        }
      });
    request.addParameter('GameId', TYPES.Int, ids.game_id);
    request.on('row', function(columns) {
      ids.date_id = columns[1].value;
      ids.req_id = columns[2].value;
      ids.thumbs_id = columns[3].value;
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function data_premiery(game,ids) {
    request = new Request('select dzien,miesiac,rok from Data_premiery where id_czasu_premiery = @DateId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          wymagania(game,ids)
        }
      });
    request.addParameter('DateId', TYPES.Int, ids.date_id);
    request.on('row', function(columns) {
      game.date = columns[0].value+"."+columns[1].value+"."+columns[2].value;
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function wymagania(game,ids) {
    request = new Request('select rekomendowane,minimalne from Wymagania_sprzetowe where id_wym = @ReqId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          lapki(game,ids);
        }
      });
    request.addParameter('ReqId', TYPES.Int, ids.req_id);
    request.on('row', function(columns) {
      game.hardware_recommended =  columns[0].value;
      game.hardware_minimal = columns[1].value;
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function lapki(game,ids) {
    request = new Request('select w_gore,w_dol from Lapki where id_lapki = @ThumbsId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          // res.json(game);
          if(iterator>=count){
            console.log("OK")
            finalizator(games)
            res.json(games)
          }
          else{
            games.push(game)
            iterator++
            gra()
          }
        }
      });
    request.addParameter('ThumbsId', TYPES.Int, ids.thumbs_id);
    request.on('row', function(columns) {
      game.thumbs_up = columns[0].value;
      game.thumbs_down = columns[1].value;
    });
    // Execute SQL statement
    connection.execSql(request);
  }


  function finalizator(games){
    const fields = ['game_id','title', 'producer', 'platform', 'category','publisher','rating_value','rating_quantity','similar','tags','date','hardware_recommended','hardware_minimal','thumbs_up','thumbs_down'];
    const opts = { fields };
    try {
      const parser = new Json2csvParser(opts);
      const csv = parser.parse(games);
      fs.writeFile('./export/games.csv', csv, function(err){
        console.log("super")
      })
    } catch (err) {
      console.error(err);
    }
  }

});


router.get('/game/:id', function(req, res, next) {
  gra()

  function gra() {

    var ids = {
      game_id: 0,
      similar_id: [],
      tags_id: [],
      date_id: 0,
      req_id:0,
      thumbs_id:0,
    }

    var obj = {
      game_id: 0,
      title: "",
      producer: "",
      platform: "",
      category: "",
      publisher: "",
      rating_value: 0,
      rating_quantity: 0,
      similar: "",
      tags:"",
      date: "",
      hardware_recommended:"",
      hardware_minimal: "",
      thumbs_up:0,
      thumbs_down:0,
      comments: []
    }
    request = new Request('select * from Gra where id_gry = @GameId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          // res.json(obj);
          gra_podobne(obj,ids)
        }

      });
    request.addParameter('GameId', TYPES.Int, req.params.id);
    request.on('row', function(columns) {
      ids.game_id = columns[0].value
      obj.game_id = columns[0].value
      obj.title = columns[1].value
      obj.producer = columns[2].value
      obj.platform = columns[3].value
      obj.category= columns[4].value
      obj.publisher = columns[5].value
      obj.rating_value= columns[6].value
      obj.rating_quantity= columns[7].value
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function gra_podobne(game,ids) {
    request = new Request('select id_podobne from Gra_podobne where id_gry = @GameId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          podobne(game,ids,0)
        }

      });
    request.addParameter('GameId', TYPES.Int, ids.game_id);
    request.on('row', function(columns) {
      ids.similar_id.push(columns[0].value)
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function podobne(game,ids,index_podobne) {
    request = new Request('select podobne from Podobne where id_podobne = @SimilarId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          if(index_podobne >= ids.similar_id.length-1)  {
            gra_tagi(game,ids)
          }
          else {
            index_podobne++
            podobne(game,ids,index_podobne)
          }
        }

      });

    request.addParameter('SimilarId', TYPES.Int, ids.similar_id[index_podobne]);

    request.on('row', function(columns) {
      game.similar += columns[0].value+";"
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function gra_tagi(game,ids) {
    request = new Request('select id_tagi from Gra_tagi where id_gry = @GameId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          tagi(game,ids,0)
        }
      });
    request.addParameter('GameId', TYPES.Int, ids.game_id);
    request.on('row', function(columns) {
      ids.tags_id.push(columns[0].value)
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function tagi(game,ids,index_tag) {
    request = new Request('select tagi from Tagi where id_tagi = @TagId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          if(index_tag >= ids.tags_id.length-1)  {
            encyklopedia(game,ids)
          }
          else {
            index_tag++
            tagi(game,ids,index_tag)
          }
        }

      });
    request.addParameter('TagId', TYPES.Int, ids.tags_id[index_tag]);
    request.on('row', function(columns) {
      game.tags += columns[0].value+";"
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function encyklopedia(game,ids) {
    request = new Request('select * from Encyklopedia_Gier where id_gry = @GameId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          data_premiery(game,ids)
        }
      });
    request.addParameter('GameId', TYPES.Int, ids.game_id);
    request.on('row', function(columns) {
      ids.date_id = columns[1].value;
      ids.req_id = columns[2].value;
      ids.thumbs_id = columns[3].value;
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function data_premiery(game,ids) {
    request = new Request('select dzien,miesiac,rok from Data_premiery where id_czasu_premiery = @DateId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          wymagania(game,ids)
        }
      });
    request.addParameter('DateId', TYPES.Int, ids.date_id);
    request.on('row', function(columns) {
      game.date = columns[0].value+"."+columns[1].value+"."+columns[2].value;
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function wymagania(game,ids) {
    request = new Request('select rekomendowane,minimalne from Wymagania_sprzetowe where id_wym = @ReqId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          lapki(game,ids);
        }
      });
    request.addParameter('ReqId', TYPES.Int, ids.req_id);
    request.on('row', function(columns) {
      game.hardware_recommended =  columns[0].value;
      game.hardware_minimal = columns[1].value;
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function lapki(game,ids) {
    request = new Request('select w_gore,w_dol from Lapki where id_lapki = @ThumbsId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          // res.json(game);
          posty(game,ids)
        }
      });
    request.addParameter('ThumbsId', TYPES.Int, ids.thumbs_id);
    request.on('row', function(columns) {
      game.thumbs_up = columns[0].value;
      game.thumbs_down = columns[1].value;
    });
    // Execute SQL statement
    connection.execSql(request);
  }

  function posty(game,ids) {
    request = new Request('select * from Posty where id_gry = @GameId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          data_posta(game,0)
        }
      });
    request.addParameter('GameId', TYPES.Int, ids.game_id);
    request.on('row', function(columns) {
      var comment_template = {
        date_id: 0,
        date: "",
        login: "",
        rank: "",
        degree: "",
        contents: ""
      }
      comment_template.date_id = columns[2].value;
      comment_template.login = columns[3].value;
      comment_template.rank = columns[4].value;
      comment_template.degree = columns[5].value;
      comment_template.contents = columns[6].value;
      game.comments.push(comment_template)
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function data_posta(game, index_posta) {
    var check = game.comments.length>0
    if(!check) {
      finalizator(game)
      res.json(game);
      return
    }
    request = new Request('select dzien,miesiac,rok,godzina,minuta from Data_posta where id_czasu_posta = @DateId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          if(index_posta >= game.comments.length-1)  {
            finalizator(game)
            res.json(game);
          }
          else {
            index_posta++
            data_posta(game,index_posta)
          }
        }
      });
    request.addParameter('DateId', TYPES.Int, game.comments[index_posta].date_id);
    request.on('row', function(columns) {
      game.comments[index_posta].date = columns[0].value+"."+columns[1].value+"."+columns[2].value +"  "+columns[3].value+":"+columns[4].value;
    });
    // Execute SQL statement
    connection.execSql(request);
  }


  function finalizator(game){
    var final_string = ""

    for (var prop in game) {
      if(game[prop] instanceof Array) {
        final_string += prop +' =\n';
        for (var i = 0; i < game[prop].length; i++) {
          final_string += '\n';
          for (var x in game[prop][i]) {
            final_string += "       " + x + " = " + game[prop][i][x] + "\n";
          }
        }
      }
      else
        final_string += prop + " = "+game[prop] +"\n";
    }

    fs.writeFile('./export/game_'+game.game_id+'.txt', final_string, function(err){
      console.log("super")
    })


  }
});



module.exports = router;

