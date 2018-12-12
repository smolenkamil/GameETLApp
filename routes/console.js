var express = require('express');
var router = express.Router();
var cwriter = require('./console-writer')

router.get('/', function(req, res, next) {
  var tmp = cwriter.getAllMessages()
  res.json({messages: tmp});
});

module.exports = router

