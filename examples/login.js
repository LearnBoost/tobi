
// Expose support modules

require.paths.unshift(__dirname + '/../support');

/**
 * Module dependencies.
 */

var app = require('./app')
  , tobi = require('../')
  , should = require('should')
  , browser = tobi.createBrowser(app);

browser.get('/login', function(res, $){
  $('form')
    .should.have.action('/login')
    .and.have.id('user')
    .and.have.method('post')
    .and.have.many('input');
  
  $('form > input[name=username]').should.have.attr('type', 'text');
  $('form > input[name=password]').should.have.attr('type', 'password');
  $('form :submit').should.have.value('Login');
});

browser.get('/login', function(res, $){
  $('form')
    .fill({ username: 'tj', password: 'tobi' })
    .submit(function(res, $){
      res.should.have.status(200);
      res.should.have.header('Content-Length');
      res.should.have.header('Content-Type', 'text/html; charset=utf-8');
      $('ul.messages').should.have.one('li', 'Successfully authenticated');
      browser.get('/login', function(res, $){
        res.should.have.status(200);
        $('ul.messages').should.have.one('li', 'Already authenticated');
        console.log('successful');
        app.close();
      });
    });
});
