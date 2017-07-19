//Author: Nauman Aman
//email: nauman.aman@ieee.org

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');


//routes
var routes = require('./routes/index');
var metrics = require('./lib/resources/metrics');
var deploy = require('./lib/resources/deploy');
var generate = require('./lib/resources/generate');


//connect to db
var db = require('./lib/db/util');

db.connect(function (err) {
    if(err){
        console.log('can not connect db: '+err);
    }
});
//disconnect db
process.on('SIGINT',function(){
    db.disconnect(function(){
        //process.exit(0);
    });
	process.exit(0);
});

var app = express();


//express middleware to parse incoming req into json 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var port = (process.env.VCAP_APP_PORT || process.env.PORT || 5500);
var host = (process.env.VCAP_APP_HOST || process.env.HOST || 'localhost');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

//API endpoints
app.use('/', routes);
app.use('/metrics',metrics);
app.use('/deploy',deploy);
app.use('/generate',generate);


// START THE SERVER with a little port reminder when run on the desktop
// =============================================================================
app.listen(port, host);
console.log('App started on port ' + port);


module.exports = app;
