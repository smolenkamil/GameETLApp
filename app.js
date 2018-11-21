var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
	url = 'https://www.gry-online.pl/daty-premier-gier.asp';
		request(url, function(error, response, html){
			
			if(!error){
				
				var $ = cheerio.load(html);
				
				var json = [];
				
				//debug
				var debug = false
				var html = ""
				
				$('.daty-premier-2017').filter(function(){
					var data = $(this);
					
					for(var i=0 ;i< data.children().length; i++) {
						var game = { link: "", date: "", title:"", platform:"", category:"" }
						data.children().map(function(i,el){
							var target
							
							target = data.children().eq(i)
							game.link = target.attr('href')
							
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
							else {json.push({link: game.link, date: game.date, title: game.title, platform: game.platform, category: game.category})}
						})
					
					}
					;
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
			
			// Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
			res.send('Check your console!')
			
			}) ;
	})
	



app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
	
