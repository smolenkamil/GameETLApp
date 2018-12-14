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



/* GET home page. */
router.get('/', function(req, res, next) {
  var obj = []
  request = new Request('select tytul,kategoria,producent,wydawca from Gra;',
    function (err, rowCount, rows)  {
      if (err) {
        console.log(err);
      } else {
        res.json(obj);
      }

    });

  request.on('row', function(columns) {
    var tmp = {
      title: columns[0].value,
      category: columns[1].value,
      producer: columns[2].value,
      publisher: columns[3].value
    }
    obj.push(tmp)
  });
  // Execute SQL statement
  connection.execSql(request);
});

router.get('/:id', function(req, res, next) {
  gra()

  function gra() {
    var obj = {
      game_id: 0,
      title: "",
      producer: "",
      platform: "",
      category: "",
      publisher: "",
      rating: {
        value: 0,
        quantity:0
      },
      similar_id: [],
      similar:[],
      tags_id: [],
      tags:[],
      date_id: 0,
      req_id:0,
      thumbs_id:0,
      date: "",
      hardware_req:["",""],
      thumbs:{
        up:0,
        down:0
      },
      comments:[]
    }
    request = new Request('select * from Gra where id_gry = @GameId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          // res.json(obj);
          gra_podobne(obj)
        }

      });
    request.addParameter('GameId', TYPES.Int, req.params.id);
    request.on('row', function(columns) {
      obj.game_id = columns[0].value
      obj.title = columns[1].value
      obj.producer = columns[2].value
      obj.platform = columns[3].value
      obj.category= columns[4].value
      obj.publisher = columns[5].value
      obj.rating.value= columns[6].value
      obj.rating.quantity= columns[7].value
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function gra_podobne(game) {
    request = new Request('select id_podobne from Gra_podobne where id_gry = @GameId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          podobne(game,0)
        }

      });
    request.addParameter('GameId', TYPES.Int, game.game_id);
    request.on('row', function(columns) {
      game.similar_id.push(columns[0].value)
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function podobne(game,index_podobne) {
    request = new Request('select podobne from Podobne where id_podobne = @SimilarId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          if(index_podobne >= game.similar_id.length-1)  {
            gra_tagi(game)
          }
          else {
            index_podobne++
            podobne(game,index_podobne)
          }
        }

      });

    request.addParameter('SimilarId', TYPES.Int, game.similar_id[index_podobne]);

    request.on('row', function(columns) {
      game.similar.push(columns[0].value)
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function gra_tagi(game) {
    request = new Request('select id_tagi from Gra_tagi where id_gry = @GameId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          tagi(game,0)
        }
      });
    request.addParameter('GameId', TYPES.Int, game.game_id);
    request.on('row', function(columns) {
      game.tags_id.push(columns[0].value)
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function tagi(game,index_tag) {
    request = new Request('select tagi from Tagi where id_tagi = @TagId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          if(index_tag >= game.tags_id.length-1)  {
            encyklopedia(game)
          }
          else {
            index_tag++
            tagi(game,index_tag)
          }
        }

      });
    request.addParameter('TagId', TYPES.Int, game.tags_id[index_tag]);
    request.on('row', function(columns) {
      game.tags.push(columns[0].value)
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function encyklopedia(game) {
    request = new Request('select * from Encyklopedia_Gier where id_gry = @GameId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          data_premiery(game)
        }
      });
    request.addParameter('GameId', TYPES.Int, game.game_id);
    request.on('row', function(columns) {
      game.date_id = columns[1].value;
      game.req_id = columns[2].value;
      game.thumbs_id = columns[3].value;
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function data_premiery(game) {
    request = new Request('select dzien,miesiac,rok from Data_premiery where id_czasu_premiery = @DateId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          wymagania(game)
        }
      });
    request.addParameter('DateId', TYPES.Int, game.date_id);
    request.on('row', function(columns) {
      game.date = columns[0].value+"."+columns[1].value+"."+columns[2].value;
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function wymagania(game) {
    request = new Request('select rekomendowane,minimalne from Wymagania_sprzetowe where id_wym = @ReqId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          lapki(game);
        }
      });
    request.addParameter('ReqId', TYPES.Int, game.req_id);
    request.on('row', function(columns) {
      game.hardware_req[0] = "Recommended: "+ columns[0].value;
      game.hardware_req[1] = "Minimal: "+ columns[1].value;
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function lapki(game) {
    request = new Request('select w_gore,w_dol from Lapki where id_lapki = @ThumbsId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          res.json(game);
        }
      });
    request.addParameter('ThumbsId', TYPES.Int, game.thumbs_id);
    request.on('row', function(columns) {
      game.thumbs.up = columns[0].value;
      game.thumbs.down = columns[1].value;
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function lapki(game) {
    request = new Request('select w_gore,w_dol from Lapki where id_lapki = @ThumbsId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          posty(game);
        }
      });
    request.addParameter('ThumbsId', TYPES.Int, game.thumbs_id);
    request.on('row', function(columns) {
      game.thumbs.up = columns[0].value;
      game.thumbs.down = columns[1].value;
    });
    // Execute SQL statement
    connection.execSql(request);
  }
  function posty(game) {
    request = new Request('select * from Posty where id_gry = @GameId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          data_posta(game,0)
        }
      });
    request.addParameter('GameId', TYPES.Int, game.game_id);
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
      res.json(game);
      return
    }
    request = new Request('select dzien,miesiac,rok,godzina,minuta from Data_posta where id_czasu_posta = @DateId;',
      function (err, rowCount, rows)  {
        if (err) {
          console.log(err);
        } else {
          if(index_posta >= game.comments.length-1)  {
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

});


module.exports = router;

