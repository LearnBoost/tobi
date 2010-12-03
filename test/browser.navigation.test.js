
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
  res.send(
      '<a id="page-two" href="/two">Page Two</a>'
    + '<a id="page-three" href="/three">Page Three</a>');
});

app.get('/two', function(req, res){
  res.send('<a id="page-three" href="/three">Page Three</a>');
});

app.get('/three', function(req, res){
  res.send('<p>Wahoo! Page Three</p>');
});

app.get('/form', function(req, res){
  res.send('<form id="user">'
    + '<input type="text" name="user[name]" />'
    + '<input type="text" name="user[email]" disabled="disabled" />'
    + '<input type="checkbox" name="user[agreement]" id="user-agreement" />'
    + '<input type="submit" value="Update" />'
    + '</form>');
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
    browser.visit.should.equal(browser.get);
    browser.open.should.equal(browser.get);
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
          browser.source.should.equal('<p>Wahoo! Page Three</p>');
          done();
        })
      });
    });
  },
  
  'test .click(id, fn)': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/one', function(){
      browser.click('page-two', function(){
        browser.should.have.property('path', '/two');
        browser.click('page-three', function(){
          browser.should.have.property('path', '/three');
          browser.source.should.equal('<p>Wahoo! Page Three</p>');
          browser.back(function(){
            browser.should.have.property('path', '/two');
            browser.back(function(){
              browser.should.have.property('path', '/one');
              browser.click('page-three', function(){
                browser.should.have.property('path', '/three');
                done();
              });
            });
          });
        })
      });
    });
  },
  
  'test .click(css, fn)': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/one', function(){
      browser.click('a[href="/two"]', function(){
        browser.should.have.property('path', '/two');
        browser.click('a[href="/three"]', function(){
          browser.should.have.property('path', '/three');
          browser.source.should.equal('<p>Wahoo! Page Three</p>');
          browser.back(2, function(){
            browser.should.have.property('path', '/one');
            done();
          });
        })
      });
    });
  },
  
  'test .check(name)': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function($){
      $('[name=user[agreement]]').should.not.have.attr('checked', 'checked');
      browser.check('user[agreement]');
      $('[name=user[agreement]]').should.have.attr('checked', 'checked');
      done();
    });
  },
  
  'test .check(css)': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function($){
      $('[name=user[agreement]]').should.not.have.attr('checked', 'checked');
      browser.check('[name=user[agreement]]');
      $('[name=user[agreement]]').should.have.attr('checked', 'checked');
      done();
    });
  },
  
  'test .check(id)': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function($){
      $('[name=user[agreement]]').should.not.have.attr('checked', 'checked');
      browser.check('user-agreement');
      $('[name=user[agreement]]').should.have.attr('checked', 'checked');
      done();
    });
  }
};