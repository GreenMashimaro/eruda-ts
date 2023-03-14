/**
 * WARNING: This demo is a barebones implementation designed for development and evaluation
 * purposes only. It is definitely NOT production ready and does not aim to be so. Exposing the
 * demo to the public as is would introduce security risks for the host.
 **/

var express = require('express');
var expressWs = require('express-ws');
var os = require('os');

function startServer() {
  var app = express();
  expressWs(app);

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  app.use('/dist', express.static(__dirname + '/dist'));
  app.use('/src', express.static(__dirname + '/src'));

  var port = process.env.PORT || 3003,
      host = os.platform() === 'win32' ? '127.0.0.1' : '0.0.0.0';

  console.log('App listening to http://127.0.0.1:' + port);
  app.listen(port, host);
}

module.exports = startServer;
