
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

app.get('/user/:id.json', function(req, res){
  res.send({ name: 'tj' });
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
  
  'test .createBrowser(server)': function(){
    var browser = chrono.createBrowser(app);
    browser.should.have.property('server', app);
  },
  
  'test .open(url)': function(){
    var browser = chrono.createBrowser(app);
    browser.open('/', function(){
      browser.should.have.property('path', '/');
      browser.history.should.eql(['/']);
      browser.open('/user/0.json', function(){
        browser.should.have.property('path', '/user/0.json');
        browser.history.should.eql(['/', '/user/0.json']);
      });
    });
  }
};