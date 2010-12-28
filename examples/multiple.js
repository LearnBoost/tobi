
// Expose support modules

require.paths.unshift(__dirname + '/../support');

/**
 * Module dependencies.
 */

var app = require('./app')
  , tobi = require('../')
  , should = require('should')
  , pending = 2;

var a = tobi.createBrowser(app);

a.get('/wizard', function(res, $){
  res.should.have.status(200);
  $('h1').should.have.text('Account');
  console.log('a successful');
  --pending || app.close();
});

var b = tobi.createBrowser(app);

b.get('/login', function(res, $){
  $('form')
    .fill({ username: 'tj', password: 'tobi' })
    .submit(function(res, $){
      res.should.have.status(200);
      res.should.have.header('Content-Length');
      res.should.have.header('Content-Type', 'text/html; charset=utf-8');
      console.log('b successful');
      --pending || app.close();
    });
});
