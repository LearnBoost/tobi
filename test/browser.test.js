
/**
 * Module dependencies.
 */

var tobi = require('tobi')
  , express = require('express')
  , Browser = tobi.Browser
  , should = require('should');

// Test app

var app = express.createServer();

app.get('/', function(req, res){
  res.send('<p>Hello World</p>');
});

app.get('/user/:id', function(req, res){
  res.send('<h1>Tobi</h1><p>the ferret</p>');
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
      , browser = tobi.createBrowser(html);
    browser.should.have.property('source', html);
  },
  
  'test .createBrowser(server)': function(){
    var browser = tobi.createBrowser(app);
    browser.should.have.property('server', app);
  },
  
  'test .request(method, path)': function(done){
    var browser = tobi.createBrowser(app);
    browser.request('GET', '/', function(){
      browser.should.have.property('path', '/');
      browser.history.should.eql(['/']);
      browser.request('GET', '/user/0', function(){
        browser.should.have.property('path', '/user/0');
        browser.history.should.eql(['/', '/user/0']);
        browser.should.have.property('source', '<h1>Tobi</h1><p>the ferret</p>');
        browser.jQuery('p').text().should.equal('the ferret');
        done();
      });
    });
  },
  
  'test .get(path)': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/', function(){
      browser.should.have.property('path', '/');
      browser.history.should.eql(['/']);
      done();
    });
  }
};