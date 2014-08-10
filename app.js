var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('barometer');

var routes = require('./routes.json');

var app = express();
var exphbs = require('express-handlebars');

//Create a db object here, and pass it in with each request. Only one connection will be opened for now.
var db = require('./routes/db.js');

//get the env and fill in config
var config = require('./config.json');
if (process.env && process.env.ENV === 'prod') {
    config = config.env.prod;
} else {
    config = config.env.dev;
}
console.log(process.env.ENV);
console.log(config);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res) {
    var ctrl = routes[req.path], controller;
    req.db = new db(config);
    if (ctrl) {
        controller = require('./routes/' + ctrl + '.js');
        controller(req, res);
    } else {
        res.send('path not found');
    }
});

//app.use('/', routes);
//app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
