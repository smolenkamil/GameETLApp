var express = require('express');
var router = express.Router();
var fs = require('fs');
var crud = require('../database/crud.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status: "OK"});
});

router.get('/test', function(req, res, next) {
  var obj = JSON.parse(fs.readFileSync('./transform.json', 'utf8'));
  crud.test(obj, 0)
  res.json({status: "OK test"});
});

module.exports = router;

