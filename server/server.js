'use strict';
require('dotenv').config()
var loopback = require('loopback');
var boot = require('loopback-boot');
var bodyParser = require('body-parser')
var app = module.exports = loopback();
var session = require('express-session')

app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
  }
}))
/*app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())*/
app.use (bodyParser.json ({limit: '50mb'}));
app.use (bodyParser.urlencoded ({
limit: '50mb',
extended: true,
parameterLimit: 50000
}));


app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
