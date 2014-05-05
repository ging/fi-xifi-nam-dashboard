/**
 * app.js
 * Author: Fernando Garcia
 * Date: 14/03/14
 */


/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , partials = require ('express-partials') 
  , sessionController = require('./routes/session_controller.js') 
  , test = require('./routes/test_controller.js')
  , app = express();



var util = require('util');

//installl middleware to renderpartial
app.use(partials());


app.configure(function(){
    app.set('port', process.env.PORT || 5000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon(__dirname + '/public/images/fi_lab_app/icons/header-logo.png'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('perfsonarPASS'));
    app.use(express.session());

    app.use(require('connect-flash')());


    // Helper dinamico:
    app.use(function(req, res, next) {
        // req.flash() 
        res.locals.flash = function() { return req.flash() };
        res.locals.session = req.session;
        next();
    });

    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});


//middleware errors

app.use(function(err, req, res, next) {
    if (util.isError(err)) {
        next(err);
    } else {
    	console.log('error http')
        console.log(err);
        req.flash('error', err);
        res.redirect('/index');
    }
});


if ('development' == app.get('env')) {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
} else {
    app.use(express.errorHandler());
}



//ROUTES
//app.get('/', routes.index);
app.get('/', 
        sessionController.requiresLogin,
        routes.index);

/*
app.get('/bwctl', host.indexbw);
app.post('/bwctl', host.testbw);
app.get('/owamp', host.indexow);
app.post('/owamp', host.testow);
*/

app.get('/bdw', 
		sessionController.requiresLogin,
		test.indexbw);
app.post('/bdw', 
		sessionController.requiresLogin,
		test.testbdw);
app.post('/bdwhistory', 
		sessionController.requiresLogin,
		test.testbdwhist);

app.get('/owd', 
		sessionController.requiresLogin,
		test.indexow);
app.post('/owd', 
		sessionController.requiresLogin,
		test.testow);
app.post('/owdhistory', 
        sessionController.requiresLogin,
        test.testowdhist);
/*

app.get('/newhost', routes.newhost);
app.get('/edithost', routes.edithost);
app.get('/delhost', routes.delhost);
*/

app.get('/login',  sessionController.new);
app.get('/logout', sessionController.destroy);


/*
app.get('/bwctl/available/', ws.availableBwctl);
app.get('/owamp/available/', ws.availableOwping);
app.get('/bwctl/avaliable/:host', ws.availableBwctl);
app.get('/owamp/avaliable/:host', ws.availableOwping);

//webservice
app.get('/ping/:ip', ws.ping);
app.get('/bwctl/:ipS/:ipD', ws.bwctl);
app.get('/owping/:ipS/:ipD', ws.owping);
app.get('/bwctl///', host.indexbw);
app.get('/owping///', host.indexow);

*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
