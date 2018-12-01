var express = require('express');
var router = express.Router();
var fs = require('fs');
var iconv = require('iconv-lite');
var encoding = 'win1250';
var request = require('request');
var cheerio = require('cheerio');
var mainData = []


router.get('/', function(req, res, next){
  req.setTimeout(900000);
  url = 'https://www.gry-online.pl/daty-premier-gier.asp';

  getDataFromMain(url).then((data) => {
    var allPs = []
    for (let i = 0, p = Promise.resolve(); i < data.length-1; i++) {
      p = p.then(_ => getDataFromSubPage('https://www.gry-online.pl' + data[i],Math.floor((i/data.length)*10000)/100));
      allPs.push(p)
    }
    Promise.all(allPs).then(function(values) {
      var finish = []
      for(var x=0;x<values.length;x++){
        finish.push(Object.assign({},mainData[x],values[x]))
      }
      fs.writeFile('output.json', JSON.stringify(finish), function(err){
        console.log('File successfully written! - Check your project directory for the output.json file');
      })
      res.send(finish)
    })
  })
})

function getDataFromSubPage(url, proc){
  return new Promise(((resolve) => {
    request({url:url, encoding:null}, function(error, response, html) {
      var htmlx = iconv.decode(html,encoding);
      resolve(retrieveDataFromHtml(htmlx, proc))
    });
  }))
}

function objDebug(mess,obj){
  var sep = "   ====================   "
  console.log(sep+"START - "+mess+sep)
  for (var prop in obj) {
    console.log(prop + " = "+obj[prop]);
  }
  console.log(sep+"END - "+mess+sep)
}

function getComments(urlx) {
  return new Promise(((resolve, reject) => {
    request({url: urlx, encoding: null}, function(error, response, html) {
      var htmlx = iconv.decode(html,encoding);
      var $ = cheerio.load(htmlx,{ decodeEntities: false });
      var comArr = []
      $('.kom-lay-2016-c').children().filter(function () {
        var data = $(this)
        if ((data.attr('id') + "").startsWith('post0')) return true;
        else return false;
      }).each(function (index, el) {
        var data = $(this)
        var komm = {date: "", login: "", rank: "", degree: "", contents: ""}
        komm.date = data.children().eq(2).text()
        var metadataTarget = data.children().filter(function () {
          var data = $(this)
          if ((data.attr('class') + "").startsWith('ptr')) return true;
          else return false;
        }).children().filter(function () {
          var data = $(this)
          if ((data.attr('class') + "").startsWith('ptt')) return true;
          else return false;
        })
        komm.login = metadataTarget.children().filter(function () {
          var data = $(this)
          if ((data.attr('class') + "").startsWith('fus')) return true;
          else return false;
        }).text()
        komm.rank = metadataTarget.children().filter(function () {
          var data = $(this)
          if ((data.attr('class') + "").startsWith('fra')) return true;
          else return false;
        }).text()
        komm.degree = metadataTarget.children().filter(function () {
          var data = $(this)
          if ((data.attr('class') + "").startsWith('fst')) return true;
          else return false;
        }).text()

        komm.contents = data.children().filter(function () {
          var data = $(this)
          if ((data.attr('class') + "").startsWith('ptr')) return true;
          else return false;
        }).children().filter(function () {
          var data = $(this)
          if ((data.attr('class') + "").startsWith('ptx')) return true;
          else return false;
        }).text()
        comArr.push(komm)
      })
      resolve(comArr)
    })
  }));
}


function retrieveDataFromHtml(html,proc){
  return new Promise(((resolve, reject) => {
    var $ = cheerio.load(html,{ decodeEntities: false });
    var textx = ""
    var json = {
      producer: "",
      publisher: "",
      tags: [],
      similar: [],
      rating: {value: "", quantity: ""},
      thumbs: {up: "", down: ""},
      hardware_req: [],
      comments_links: [],
      comments: []
    };
    $('.S016-game-info').filter(function () {
      var data = $(this);
      var target
      target = data.children().first().children().first().children().first()
      json.producer = target.text()
      target = data.children().eq(1).children().first().children().first()
      json.publisher = target.text()
    })
    $('#game-tags-cnt').find('a').each(function (index, el) {
      json.tags.push($(this).text())
    })
    $('#game-similar-cnt').find('div').children().find('p').each(function (index, el) {
      json.similar.push($(this).text())
    })
    $('#game-misc-cnt').children().eq(1).children().first().children().each(function (index, el) {
      var data = $(this);
      if (index === 0) json.rating.value = data.text()
      else if (index === 2) json.rating.quantity = data.text()
    })
    $('.dbLapUp').filter(function () {
      json.thumbs.up = $(this).text()
    })
    $('.dbLapDown').filter(function () {
      json.thumbs.down = $(this).text()
    })
    $('#game-requirements-cnt-1-c').filter(function () {
      var data = $(this)
      var dt = data.html().split('<br>')
      for (var i = 0; i < dt.length; i++) {
        var wrapped = {id: "", value: ""}
        dt[i] = dt[i].split('<b>')[1]
        wrapped.id = dt[i].split('</b>')[0]
        wrapped.value = dt[i].split('</b>')[1]
        json.hardware_req.push(wrapped)
      }
    })
    var linkTemplate = ""
    $('body').children().first().filter(function () {
      linkTemplate = 'https://www.gry-online.pl/ajax/komentarze_gra.asp?ID=' + $(this).attr('data-game-id') + '&PLAT='
    })

    $('.but-neu-tab').children().each(function () {
      json.comments_links.push(linkTemplate + $(this).attr('id').split('-')[2])
    })
    if (json.comments_links.length < 1) json.comments_links.push(linkTemplate + 1)


    var allPs = []
    for (let i = 0, p = Promise.resolve(); i < json.comments_links.length; i++) {
      p = p.then(_ => getComments(json.comments_links[i]));
      allPs.push(p)
    }
    Promise.all(allPs).then(function (values) {
      var commentArr = []
      for (var i = 0; i < values.length; i++) {
        commentArr = commentArr.concat(values[i])
      }
      json.comments = commentArr
      console.log("PROGRESS: " + proc + "%")
      resolve(json)
    })
  }))
}



function getDataFromMain(url){
  return new Promise(((resolve, reject) => {
    request({url:url, encoding:null}, function(error, response, html){
      if(!error){
        var htmlx = iconv.decode(html,encoding);
        var $ = cheerio.load(htmlx,{ decodeEntities: false });
        var json = [];
        var links = []
        //debug
        var debug = false
        var html = ""
        $('.daty-premier-2017').filter(function(){
          var data = $(this);
          var index = 0
          var game = { link: "", date: "", title:"", platform:"", category:"" }
          data.children().map(function(i,el){
            var target
            target = data.children().eq(i)
            game.link = target.attr('href')
            links.push(game.link)
            target = target.children().first()
            game.date = target.text()
            target = target.next()
            game.title = target.text()
            target = target.next()
            game.platform = target.text()
            target = target.prev().children().first()
            game.category = target.text()
            //debug
            if(debug){ html += '\n \n' + Object.values(game).join("\n")}
            else {
              json.push(
                {
                  link: game.link,
                  date: game.date,
                  title: game.title,
                  platform: game.platform,
                  category: game.category
                }
              )
            }
          });
        })
      }
      mainData = Object.assign({},json)
      resolve(links)
    })
  }))
}


console.log('So it begins');
module.exports = router;
