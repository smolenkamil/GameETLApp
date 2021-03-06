var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var scrapRouter = require('./routes/scrap-games');
var loadRouter = require('./routes/load-games');
var transformRouter = require('./routes/transform');
var dbload = require('./routes/load-db');
var console = require('./routes/console');
var exportCSV = require('./routes/export-to-csv')
var deleteData = require('./routes/delete')


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist/gameETL')));
app.use('/', express.static(path.join(__dirname, 'dist/gameETL')));
app.use('/scrap', scrapRouter);
app.use('/load', loadRouter);
app.use('/transform', transformRouter);
app.use('/dbload', dbload);
app.use('/console', console);
app.use('/export', exportCSV);
app.use('/delete', deleteData);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.status);
});

module.exports = app;
