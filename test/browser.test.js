
/**
 * Module dependencies.
 */

var chrono = require('chrono')
  , express = require('express')
  , Browser = chrono.Browser
  , should = require('should');

// Test app

var app = express.createServer();

app.get('/', function(req, res){
  res.send('Hello World');
});

module.exports = {
  'test Browser(str)': function(){
    var html = '<ul><li>one</li><li>two</li></ul>'
      , browser = new Browser(html);
    browser.should.have.property('source', html);
    browser.should.have.property('window');
    browser.should.have.property('jQuery');
  },
  
  'test .createBrowser(str)': function(){
    var html = '<ul><li>one</li><li>two</li></ul>'
      , browser = chrono.createBrowser(html);
    browser.should.have.property('source', html);
  },
  
  'test request': function(){
    var browser = chrono.createBrowser(app);
    browser.should.have.property('server', app);
  }
};