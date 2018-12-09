var express = require('express');
var router = express.Router();
var fs = require('fs');


router.get('/', function(req, res, next) {
  var obj = JSON.parse(fs.readFileSync('./output.json', 'utf8'));

  for(var i=0;i<obj.length;i++){
    obj[i].date = formatDate(obj[i].date)
    obj[i].rating = formatRating(obj[i].rating)
    obj[i].thumbs = formatThumbs(obj[i].thumbs)
    obj[i].tags = arrToStr(obj[i].tags)
    obj[i].similar = arrToStr(obj[i].similar)
    obj[i].hardware_req = formatHardwareReq(obj[i].hardware_req)
    obj[i].comments = formatComments(obj[i].comments)
  }

  fs.writeFile('transform.json', JSON.stringify(obj), function(err){
    console.log('File successfully written! - Check your project directory for the transform.json file');
  })
  res.json(obj);
});

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
  }
  return comments
}



function arrToStr(arr){
  var str = ""
  for(var i=0;i<arr.length;i++){
    if(i===arr.length-1) { str += arr[i]; break; }
    str += arr[i] + ", ";
  }
  return str
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
  tmpRating.value = parseInt(rating.value)
  tmpRating.quantity = parseInt(rating.quantity)
  return tmpRating
}

function formatThumbs(thumbs){
  var tmpThumbs = {}
  tmpThumbs.up = parseInt(thumbs.up)
  tmpThumbs.down = parseInt(thumbs.down)
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

