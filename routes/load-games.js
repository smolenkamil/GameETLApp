var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  var obj = JSON.parse(fs.readFileSync('./output.json', 'utf8'));
  res.json(obj);
});

router.get('/:id', function(req, res, next) {
  var obj = JSON.parse(fs.readFileSync('./output.json', 'utf8'));
  res.json(obj[req.params.id]);
});

module.exports = router;

