var express = require('express');
var router = express.Router();
var fs = require('fs');
var consolex = require('./console-writer')


router.get('/', function(req, res, next) {
  consolex.showTxt("")
  consolex.showTxt("  |TRANSFORM - START|")
  var obj = JSON.parse(fs.readFileSync('./output.json', 'utf8'));

  for(var i=0;i<obj.length;i++){
    obj[i].title = formatTitle(obj[i].title)
    obj[i].category = signsConvertion(obj[i].category)
    obj[i].date = formatDate(obj[i].date)
    obj[i].rating = formatRating(obj[i].rating)
    obj[i].thumbs = formatThumbs(obj[i].thumbs)
    obj[i].tags = formatArr(obj[i].tags)
    obj[i].similar = formatArr(obj[i].similar)
    obj[i].hardware_req = formatHardwareReq(obj[i].hardware_req)
    obj[i].comments = formatComments(obj[i].comments)
  }

  consolex.showTxt("Title formatted for "+obj.length+" games!")
  consolex.showTxt("Date formatted for "+obj.length+" games!")
  consolex.showTxt("Rating formatted for "+obj.length+" games!")
  consolex.showTxt("Thumbs formatted for "+obj.length+" games!")
  consolex.showTxt("Tags formatted for "+obj.length+" games!")
  consolex.showTxt("Similar formatted for "+obj.length+" games!")
  consolex.showTxt("Hardware requirements formatted for "+obj.length+" games!")
  consolex.showTxt("Comments formatted for "+obj.length+" games!")

  fs.writeFile('transform.json', JSON.stringify(obj), function(err){
    consolex.showTxt("File successfully written! - transform.json")
  })
  consolex.showTxt("  |TRANSFORM - END|")
  res.json(obj);
});


function signsConvertion(text){
  text = text.replace(/ę/ig,'e');
  text = text.replace(/ż/ig,'z');
  text = text.replace(/ó/ig,'o');
  text = text.replace(/ł/ig,'l');
  text = text.replace(/ć/ig,'c');
  text = text.replace(/ś/ig,'s');
  text = text.replace(/ź/ig,'z');
  text = text.replace(/ń/ig,'n');
  text = text.replace(/ą/ig,'a');
  return text

}




function formatTitle(title){
  var tmp = title.split(" ");
  tmp.splice(tmp.length-1,1)
  return signsConvertion(tmp.join(" "))
}


function formatComments(comments){
  for(var i=0;i<comments.length;i++){
    var newDate = {
      day: 0,
      month: 0,
      year: 0,
      hour: 0,
      minute: 0
    }
    var oldDate = comments[i].date.split(" ")
    var entitiesD = oldDate[0].split(".")
    var entitiesT = oldDate[1].split(":")
    newDate.day = parseInt(entitiesD[0])
    newDate.month = parseInt(entitiesD[1])
    newDate.year = parseInt(entitiesD[2])
    newDate.hour = parseInt(entitiesT[0])
    newDate.minute = parseInt(entitiesT[1])
    comments[i].date = newDate
    comments[i].rank = parseInt(comments[i].rank)
    comments[i].degree = signsConvertion(comments[i].degree)
    var tmp = comments[i].contents.split("\n")
    comments[i].contents = signsConvertion(tmp.join(" ").substr(0,7999))
  }
  return comments
}


function formatArr(arr){
  for(var i=0;i<arr.length;i++){
    arr[i]=signsConvertion(arr[i])
  }
  return arr
}


function formatHardwareReq(requirements) {
  var tmpRequirements = {
    recommended: "",
    minimal: ""
  }
  for(var i=0;i<requirements.length;i++){
      switch (requirements[i].id){
        case "Rekomendowane:": tmpRequirements.recommended = requirements[i].value; break;
        case "Minimalne:": tmpRequirements.minimal = requirements[i].value; break;
      }
  }
  return tmpRequirements
}


function formatRating(rating){
  var tmpRating = {}
  tmpRating.value = parseInt(rating.value) || 0
  tmpRating.quantity = parseInt(rating.quantity) || 0
  return tmpRating
}

function formatThumbs(thumbs){
  var tmpThumbs = {}
  tmpThumbs.up = parseInt(thumbs.up) || 0
  tmpThumbs.down = parseInt(thumbs.down) || 0
  return tmpThumbs
}

function formatDate(date){
  var newDate = {
    day: 0,
    month: 0,
    year: 0
  }
  var oldDate = date.split(" ")
  newDate.day = parseInt(oldDate[0])
  switch (oldDate[1]) {
    case "stycznia": newDate.month = 1; break;
    case "lutego": newDate.month = 2; break;
    case "marca": newDate.month = 3; break;
    case "kwietnia": newDate.month = 4; break;
    case "maja": newDate.month = 5; break;
    case "czerwca": newDate.month = 6; break;
    case "lipca": newDate.month = 7; break;
    case "sierpnia": newDate.month = 8; break;
    case "września": newDate.month = 9; break;
    case "października": newDate.month = 10; break;
    case "listopada": newDate.month = 11; break;
    case "grudnia": newDate.month = 12; break;
  }
  newDate.year = parseInt(oldDate[2])
  return newDate
}

module.exports = router;

