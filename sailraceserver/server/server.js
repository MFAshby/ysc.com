'use strict';

var retryCount = 0;
(function waitForConnectThenStartServer() {
  var datasources = require('./datasources');
  var connection = require(datasources.db.connector).createConnection(datasources.db);
  connection.connect((err) => {
    if (err) {
      console.log("Error connecting, retrying in 1s");
      retryCount++;
      if (retryCount > 30) {
        console.log("Retried the db 30 times");
        console.log(err);
      }
      setTimeout(waitForConnectThenStartServer, 1000);
    } else {
      startServer();
    }
  });
})();

function startServer() {
  var loopback = require('loopback');
  var boot = require('loopback-boot');

  var app = module.exports = loopback();

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
}