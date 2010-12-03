
/**
 * Module dependencies.
 */

var tobi = require('tobi')
  , express = require('express')
  , should = require('should');

// Test app

var app = express.createServer()
  , browser = tobi.createBrowser(app);

app.get('/user/:id', function(req, res){
  res.send('<h1 id="title">Tobi</h1><p>the ferret</p>');
});

module.exports = {
  'test ': function(done){
    browser.get('/user/1', function($){
      $('p').prev().should.have.text('Tobi');
      done();
    });
  }
};