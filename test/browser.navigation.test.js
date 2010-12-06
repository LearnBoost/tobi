
/**
 * Module dependencies.
 */

var tobi = require('tobi')
  , express = require('express')
  , Browser = tobi.Browser
  , should = require('should');

// Test app

var app = express.createServer();

app.use(express.bodyDecoder());

app.get('/', function(req, res){
  res.send('<p>Hello World</p>');
});

app.get('/404', function(req, res){
  res.send(404);
});

app.get('/500', function(req, res){
  res.send(500);
});

app.get('/redirect', function(req, res){
  res.redirect('/one');
});

app.get('/json', function(req, res){
  res.send({ user: 'tj' });
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
  res.send('<form id="user" action="/form" method="post">'
    + '<input type="text" name="user[name]" />'
    + '<input type="text" name="user[email]" disabled="disabled" />'
    + '<input type="checkbox" name="user[agreement]" id="user-agreement" value="yes" />'
    + '<input type="submit" value="Update" />'
    + '<fieldset>'
    + '  <select name="user[forum_digest]">'
    + '    <option value="none">None</option>'
    + '    <option value="daily">Once per day</option>'
    + '    <option value="weekly">Once per week</option>'
    + '  </select>'
    + '  <textarea id="signature" name="user[signature]"></textarea>'
    + '  <input type="radio" name="user[display_signature]" value="Yes" />'
    + '  <input type="radio" name="user[display_signature]" value="No" />'
    + '</fieldset>'
    + '</form>');
});

app.post('/form', function(req, res){
  res.send({ headers: req.headers, body: req.body });
});

module.exports = {
  'test .request() non-html': function(done){
    var browser = tobi.createBrowser(app);
    browser.request('GET', '/json', {}, function(res){
      res.body.should.eql({ user: 'tj' });
      done();
    });
  },

  'test .request() 404': function(done){
    var browser = tobi.createBrowser(app);
    browser.on('error', function(err){
      err.should.have.property('message', 'GET /404 responded with 404 "Not Found"');
      done();
    });
    browser.request('GET', '/404', {}, function(){});
  },
  
  'test .request() error': function(done){
    var browser = tobi.createBrowser(app);
    browser.on('error', function(err){
      err.should.have.property('message', 'GET /500 responded with 500 "Internal Server Error"');
      done();
    });
    browser.request('GET', '/500', {}, function(){});
  },

  'test .request(method, path)': function(done){
    var browser = tobi.createBrowser(app);
    browser.request('GET', '/', {}, function($){
      $.should.equal(browser.jQuery);
      browser.should.have.property('path', '/');
      browser.history.should.eql(['/']);
      browser.request('GET', '/user/0', {}, function(){
        browser.should.have.property('path', '/user/0');
        browser.history.should.eql(['/', '/user/0']);
        browser.should.have.property('source', '<h1>Tobi</h1><p>the ferret</p>');
        browser.jQuery('p').text().should.equal('the ferret');
        done();
      });
    });
  },
  
  'test .request() redirect': function(done){
    var browser = tobi.createBrowser(app);
    browser.request('GET', '/redirect', {}, function($){
      browser.should.have.property('path', '/one');
      browser.history.should.eql(['/redirect', '/one']);
      done();
    });
  },
  
  'test .back(fn)': function(done){
    var browser = tobi.createBrowser(app);
    browser.request('GET', '/', {}, function($){
      browser.request('GET', '/user/0', {}, function(){
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
      $('[name=user[agreement]]').should.not.be.checked;
      browser.check('user[agreement]');
      $('[name=user[agreement]]').should.be.checked;
      done();
    });
  },
  
  'test .check(css)': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function($){
      $('[name=user[agreement]]').should.not.be.checked;
      browser.check('[name=user[agreement]]');
      $('[name=user[agreement]]').should.be.checked;
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
  },
  
  'test jQuery#click(fn)': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/one', function($){
      $('a:last-child').click(function(){
        browser.should.have.property('path', '/three');
        browser.back(function(){
          $('a').click(function(){
            browser.should.have.property('path', '/two');
            done();
          });
        });
      });
    });
  },
  
  'test jQuery#click(fn) form submit button': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function($){
      $('[name=user[name]]').val('tjholowaychuk');
      $('[name=user[email]]').val('tj@vision-media.ca');
      $('[type=submit]').click(function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({ user: { name: 'tjholowaychuk', signature: '' }});
        done();
      });
    });
  },
  
  'test .type()': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function($){
      browser.type('user[name]', 'tjholowaychuk');
      browser.type('user[email]', 'tj@vision-media.ca');
      browser.click('Update', function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({ user: { name: 'tjholowaychuk', signature: '' }});
        done();
      });
    });
  },
  
  'test .type() chaining': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function($){
      browser
      .type('user[name]', 'tjholowaychuk')
      .type('user[email]', 'tj@vision-media.ca')
      .check('user[agreement]')
      .click('Update', function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: 'tjholowaychuk'
            , agreement: 'yes'
            , signature: ''
          }
        });
        done();
      });
    });
  },
  
  'test .fill(obj)': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function($){
      browser.fill({
          'user[name]': 'tjholowaychuk'
        , 'user[email]': 'tj@vision-media.ca'
        , 'user[agreement]': true
        , 'signature': 'TJ Holowaychuk'
      })
      .click('Update', function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: 'tjholowaychuk'
            , agreement: 'yes'
            , signature: 'TJ Holowaychuk'
          }
        });
        done();
      });
    });
  },
  
  'test jQuery#submit()': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function($){
      $('[name=user[name]]').val('tjholowaychuk');
      $('#signature').val('Wahoo');
       $('form').submit(function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: 'tjholowaychuk'
            , signature: 'Wahoo'
          }
        });
        done();
      });
    });
  },
  
  'test .submit()': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function($){
      $('[name=user[name]]').val('tjholowaychuk');
      $('#signature').val('Wahoo');
       browser.submit('user', function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: 'tjholowaychuk'
            , signature: 'Wahoo'
          }
        });
        done();
      });
    });
  },
  
  'test select single option': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function($){
      $('select option[value=daily]').attr('selected', 'selected');
       browser.submit('user', function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: ''
            , signature: ''
            , forum_digest: 'daily'
          }
        });
        done();
      });
    });
  },
  
  'test select multiple options': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function($){
      $('select option[value=daily]').attr('selected', 'selected');
      $('select option[value=weekly]').attr('selected', 'selected');
       browser.submit('user', function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: ''
            , signature: ''
            , forum_digest: ['daily', 'weekly']
          }
        });
        done();
      });
    });
  },
  
  'test .select() single option by value': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function($){
      $('select option[value=daily]').attr('selected', 'selected');
       browser
       .select('user[forum_digest]', 'daily')
       .submit('user', function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: ''
            , signature: ''
            , forum_digest: 'daily'
          }
        });
        done();
      });
    });
  },
  
  'test .select() multiple options by value': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function($){
      $('select option[value=daily]').attr('selected', 'selected');
       browser
       .select('user[forum_digest]', ['daily', 'weekly'])
       .submit('user', function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: ''
            , signature: ''
            , forum_digest: ['daily', 'weekly']
          }
        });
        done();
      });
    });
  },
  
  'test .select() multiple options by text': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function($){
      $('select option[value=daily]').attr('selected', 'selected');
       browser
       .select('user[forum_digest]', ['Once per day', 'Once per week'])
       .submit('user', function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: ''
            , signature: ''
            , forum_digest: ['daily', 'weekly']
          }
        });
        done();
      });
    });
  },
  
  after: function(){
    app.close();
  }
};