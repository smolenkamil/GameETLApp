var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app= express();

app.get('/scrape', function(req, res){
    url = 'https://www.gry-online.pl/daty-premier-gier.asp';

    getDataFromMain(url).then((data) => {
        var allPs = []
        for (let i = 0, p = Promise.resolve(); i < 2; i++) {
            p = p.then(_ => getDataFromSubPage('https://www.gry-online.pl' + data[i],Math.floor((i/data.length)*10000)/100));
            allPs.push(p)
        }
        Promise.all(allPs).then(function(values) {
            res.send(values)
        });
    })

})

function getDataFromSubPage(url, proc){
    return new Promise(((resolve, reject) => {
        request(url, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                var textx = ""
                var json = { producent: "", wydawca: "", tagi: [], podobne: [] };
                $('.S016-game-info').filter(function(){
                    var data = $(this);
                    var target
                    target = data.children().first().children().first().children().first()
                    json.producent = target.text()
                    target = data.children().eq(1).children().first().children().first()
                    json.wydawca = target.html()
                })
                $('#game-tags-cnt').find('a').each(function (index, el) {
                    json.tagi.push($(this).html())
                })
                $('#game-similar-cnt').find('div').children().find('p').each(function (index, el) {
                    json.podobne.push($(this).html())
                })
                console.log("PROGRESS: "+ proc + "%")
            }
            resolve(json)
        })
    }))
}

function getDataFromMain(url){
    return new Promise(((resolve, reject) => {
        request(url, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                var json = [];
                var links = []
                //debug
                var debug = true
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
            if(debug){
                fs.writeFile('output.txt', html , function(err){
                    console.log('File successfully written! - Check your project directory for the output.txt file');
                })
            }
            else {
                fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
                    console.log('File successfully written! - Check your project directory for the output.json file');
                })
            }
            resolve(links)
        })
    }))
}


app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
	
