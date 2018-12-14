var express = require('express');
var router = express.Router();
var fs = require('fs');
var crud = require('../database/crud.js')
var consolex = require('./console-writer')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status: "OK"});
});

router.get('/load', function(req, res, next) {
  var obj = JSON.parse(fs.readFileSync('./transform.json', 'utf8'));
  console.log("!!!!")
  consolex.showTxt("")
  consolex.showTxt("  |LOAD - START|")
  crud.insert(obj, 0)
  var timer = setInterval(()=>{
    console.log("check!: "+crud.finish)
    if(crud.finish){
      crud.finish = false;
      clearInterval(timer);
      res.json({status: "OK test"});
    }
  },1000)
});

module.exports = router;

