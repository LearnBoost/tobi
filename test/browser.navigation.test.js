
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

app.get('/one', function(req, res){
  res.send('<a id="page-two" href="/two">Page Two</a>');
});

app.get('/two', function(req, res){
  res.send('<a id="page-three" href="/three">Page Three</a>');
});

app.get('/three', function(req, res){
  res.send('Wahoo! Page Three');
});

module.exports = {
  'test .request(method, path)': function(done){
    var browser = tobi.createBrowser(app);
    browser.request('GET', '/', function($){
      $.should.equal(browser.jQuery);
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
  
  'test .back(fn)': function(done){
    var browser = tobi.createBrowser(app);
    browser.request('GET', '/', function($){
      browser.request('GET', '/user/0', function(){
        browser.back(function(){
          browser.should.have.property('path', '/');
          done();
        });
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
  },
  
  'test .click(text, fn)': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/one', function(){
      browser.click('Page Two', function(){
        browser.should.have.property('path', '/two');
        browser.click('Page Three', function(){
          browser.should.have.property('path', '/three');
          browser.source.should.equal('Wahoo! Page Three');
          done();
        })
      });
    });
  }
};