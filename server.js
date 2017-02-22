var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');

// Control de acceso
var passport=require('passport');

// Modules to store session
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var debug = require('debug')('conferencia:server');

// Importamos los enrutadores
var index = require('./server/routes/index');
var users = require('./server/routes/users');
var speakers = require('./server/routes/speakers');


// Configuración de la Base de Datos
var config = require('./server/config/config');
// Conexión a la Base de Datos
mongoose.connect(config.url,function(error, db){
    if (error)
        debug('Error al conectar a MongoDB');
    debug('Conectado a MongoDB');
});
mongoose.connection.on('error', function(){
    debug('Error en la conexión a MongoDB. Compruebe que el servidor está operativo');
});


var app = express();

// Passport configuration
require('./server/config/passport.js')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware:

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));

// Requerido por passport
// Palabra secreta para generar las sessions
// Encriptacion y guardado  de sesiones en Mongo
app.use(session({ secret: 'poneralgodetextoaqui', saveUninitialized: true, resave: true,
    //store session on MongoDB using express-session + connectmongo
    store: new MongoStore({ url: config.url, collection : 'sessions' })}));

// Utilizamos flash para los avisos
app.use(flash());

// Inicialización de la autenticación de Passport
app.use(passport.initialize());
// Sesiones de acceso persistentes:
app.use(passport.session());

// Utilizamos los enrutadores para las distintas path
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
