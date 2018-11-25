var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app= express();
var phantom = require('phantom')

app.get('/scrape', function(req, res){
    url = 'https://www.gry-online.pl/daty-premier-gier.asp';

    getDataFromMain(url).then((data) => {
        var allPs = []
        for (let i = 0, p = Promise.resolve(); i < 2; i++) {
            if(i>0)i += 4
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

        phantom.create().then(function(ph) {
            ph.createPage().then(function(page) {
                page.open(url).then(function(status) {
                    console.log("STATUS:    "+status);
                    page.property('content').then(function(content) {
                        resolve(retrieveDataFromHtml(content,proc))
                        page.close();
                        ph.exit();
                    });
                });
            });
        });

    }))
}


function retrieveDataFromHtml(html,proc){
    var $ = cheerio.load(html);
    var textx = ""
    var json = { producer: "", publisher: "", tags: [], similar: [], rating: {value: "", quantity: ""},thumbs: {up: "", down: ""}, hardware_req: [], comments: [] };
    $('.S016-game-info').filter(function(){
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
    $('#game-misc-cnt').children().eq(1).children().first().children().each(function (index,el) {
        var data = $(this);
        if(index === 0) json.rating.value = data.text()
        else if(index === 2) json.rating.quantity = data.text()
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
        for(var i=0;i<dt.length;i++){
            var wrapped = { id: "", value: ""}
            dt[i] = dt[i].split('<b>')[1]
            wrapped.id = dt[i].split('</b>')[0]
            wrapped.value = dt[i].split('</b>')[1]
            json.hardware_req.push(wrapped)
        }
    })
    $('.kom-lay-2016-c').children().filter(function () {
        var data = $(this)
        if((data.attr('id')+"").startsWith('post0')) return true;
        else return false;
    }).each(function (index,el){
        var data = $(this)
        var komm = { date: "", login: "", rank: "", degree: "", contents: ""}
        komm.date = data.children().eq(2).text()
        var metadataTarget = data.children().filter(function () {
            var data = $(this)
            if((data.attr('class')+"").startsWith('ptr')) return true;
            else return false;
        }).children().filter(function () {
            var data = $(this)
            if((data.attr('class')+"").startsWith('ptt')) return true;
            else return false;
        })
        komm.login = metadataTarget.children().filter(function () {
            var data = $(this)
            if((data.attr('class')+"").startsWith('fus')) return true;
            else return false;
        }).text()
        komm.rank = metadataTarget.children().filter(function () {
            var data = $(this)
            if((data.attr('class')+"").startsWith('fra')) return true;
            else return false;
        }).text()
        komm.degree = metadataTarget.children().filter(function () {
            var data = $(this)
            if((data.attr('class')+"").startsWith('fst')) return true;
            else return false;
        }).text()

        komm.contents = data.children().filter(function () {
            var data = $(this)
            if((data.attr('class')+"").startsWith('ptr')) return true;
            else return false;
        }).children().filter(function () {
            var data = $(this)
            if((data.attr('class')+"").startsWith('ptx')) return true;
            else return false;
        }).text()
        json.comments.push(komm)
    })
    console.log("PROGRESS: "+ proc + "%")
    return json
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
	
