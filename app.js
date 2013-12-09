
/**
 * Module dependencies.
 */

var express   = require('express');
var routes    = require('./routes');
var http      = require('http');
var path      = require('path');
var MongoStore = require('connect-mongo')(express);
var settings = require('./config');
var flash = require('connect-flash');
var partials  = require('express-partials');

var app       = express();

app.configure(function(){
    app.set('port', process.env.PORT || 80);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(flash());
    app.use(partials());
    app.use(express.favicon());
    app.use(express.logger('dev'));
    //app.use(express.bodyParser({ keepExtensions: true, uploadDir: './upload/zt' }));
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: settings.cookieSecret,
        key: settings.db,//cookie name
        cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
        store: new MongoStore({
            db: settings.db
        })
    }));
    app.use(app.router);
    app.use('/static', express.static(path.join(__dirname, '/public')));
    //app.use(express.static(path.join(__dirname, 'upload')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

routes(app);