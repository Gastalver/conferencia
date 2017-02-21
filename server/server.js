var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var debug = require('debug')('conferencia:server');

var app = express();

var index = require('./routes/index');
var users = require('./routes/users');
var speakers = require('./routes/speakers');
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Conexión a base de datos
mongoose.connect('mongodb://127.0.0.1/conferencia',function(error, db){
    debug('Conectado a MongoDB');
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('../../public'));

app.use('/', index);
app.use('/users', users);
app.use('/api', speakers);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/**
 * Get port from environment and store in Express.
 */
var port = (process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

app.listen(app.get('port'),function(){
   debug('Escuchando en puerto ' + port);
});
