
/**
 * Module dependencies.
 */

var tobi = require('../')
  , express = require('express')
  , Browser = tobi.Browser
  , should = require('should');

// Test app

var app = express.createServer();

app.use(express.bodyParser());

app.get('/', function(req, res){
  res.send('<p>Hello World</p>');
});

app.post('/', function(req, res){
  res.send('<p>POST</p>');
});

app.put('/', function(req, res){
  res.send('<p>PUT</p>');
});

app.del('/', function(req, res){
  res.send('<p>DELETE</p>');
});

app.get('/404', function(req, res){
  res.send(404);
});

app.get('/500', function(req, res){
  res.send('<p>OH NO!</p>', 500);
});

app.get('/redirect', function(req, res){
  res.redirect('/one');
});

app.get('/xml', function(req, res){
  res.contentType('.xml');
  res.send('<user><name>tj</name></user>');
});

app.get('/json', function(req, res){
  res.send({ user: 'tj' });
});

app.get('/users.json', function(req, res){
  res.send([
      { name: 'tobi' }
    , { name: 'loki' }
    , { name: 'jane' }
  ]);
});

app.get('/users', function(req, res){
  res.send('<html><body><a href="/users.json">Users JSON</a></body></html>');
});

app.get('/invalid-json', function(req, res){
  res.send('{"broken":', { 'Content-Type': 'application/json' });
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

app.get('/search', function(req, res){
  res.send('<form action="/search/results">'
    + '<input type="text" name="query" />'
    + '</form>');
});

app.get('/search/results', function(req, res){
  res.send(req.query);
});

app.get('/form', function(req, res){
  res.send('<form id="user" method="post">'
    + '<input id="user-name" type="text" name="user[name]" />'
    + '<input id="user-email" type="text" name="user[email]" disabled="disabled" />'
    + '<input type="checkbox" name="user[agreement]" id="user-agreement" value="yes" />'
    + '<input type="checkbox" name="user[subscribe]" checked="checked" value="yes" />'
    + '<input type="submit" name="update" value="Update" />'
    + '<fieldset>'
    + '  <select name="user[forum_digest]" size="2" multiple>'
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

app.get('/form-nested', function(req, res){
  res.send('<form id="user" method="post" action="/form">'
    + '<input id="user-name" type="text" name="user[name]" />'
    + '<input id="user-email" type="text" name="user[email]" disabled="disabled" />'
    + '<input type="checkbox" name="user[agreement]" id="user-agreement" value="yes" />'
    + '<input type="checkbox" name="user[subscribe]" checked="checked" value="yes" />'
    + '<fieldset>'
    + '  <select name="user[forum_digest]">'
    + '    <option value="none">None</option>'
    + '    <option value="daily">Once per day</option>'
    + '    <option value="weekly">Once per week</option>'
    + '  </select>'
    + '  <textarea id="signature" name="user[signature]"></textarea>'
    + '  <input type="radio" name="user[display_signature]" value="Yes" />'
    + '  <input type="radio" name="user[display_signature]" value="No" />'
    + '  <input type="submit" value="Update" />'
    + '</fieldset>'
    + '</form>');
});

app.post('/form', function(req, res){
  res.send({ headers: req.headers, body: req.body });
});

// Deferred app

var appDeferred = express.createServer()
  , oldListen = appDeferred.listen;

appDeferred.listen = function(){
  var args = arguments;
  setTimeout(function(){
    oldListen.apply(appDeferred, args);
  }, 100);
};

appDeferred.get('/', function(req, res){
  res.send(200);
});

module.exports = {
  'test .request() invalid response': function(done){
    var browser = tobi.createBrowser(app);
    browser.on('error', function(err){
      err.message.should.equal('Unexpected end of input');
      done();
    });
    browser.request('GET', '/invalid-json', {}, function(res){
      // Nothing
    });
  },
  
  'test .request() non-html': function(done){
    var browser = tobi.createBrowser(app);
    browser.request('GET', '/xml', {}, function(res){
      res.should.have.header('Content-Type', 'application/xml');
      res.should.not.have.property('body');
      done();
    });
  },
  
  'test .createBrowser(port, host)': function(done){
    var server = express.createServer();
    server.get('/', function(req, res){ res.send({ hello: 'tobi' }); });
    server.listen(9999);
    server.on('listening', function(){
      var browser = tobi.createBrowser(9999, '127.0.0.1');
      browser.request('GET', '/', {}, function(res, obj){
        res.should.have.status(200);
        obj.should.eql({ hello: 'tobi' });
        server.close();
        done();
      });
    });
  },

  'test .request() json': function(done){
    var browser = tobi.createBrowser(app);
    browser.request('GET', '/json', {}, function(res, obj){
      res.body.should.eql({ user: 'tj' });
      obj.should.eql({ user: 'tj' });

      browser.get('/json', function(res, obj){
        obj.should.eql({ user: 'tj' });
        done();
      });
    });
  },

  'test .request() 404': function(done){
    var browser = tobi.createBrowser(app);
    browser.request('GET', '/404', {}, function(res){
      res.should.have.status(404);
      done();
    });
  },
  
  'test .request() error': function(done){
    var browser = tobi.createBrowser(app);
    browser.request('GET', '/500', {}, function(res, $){
      res.should.have.status(500);
      $('p').text().should.equal('OH NO!');
      done();
    });
  },

  'test .request(method, path)': function(done){
    var browser = tobi.createBrowser(app);
    browser.request('GET', '/', {}, function(res, $){
      res.should.have.status(200);
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

  'test .request(method, url)': function(done){
    var browser = tobi.createBrowser(app);
    browser.request('GET', 'http://127.0.0.1:' + app.__port, {}, function(res, $){
      res.should.have.status(200);
      browser.should.have.property('path', '/');
      browser.history.should.eql(['/']);
      browser.request('GET', 'http://127.0.0.1:' + app.__port + '/user/0', {}, function(){
        browser.should.have.property('path', '/user/0');
        browser.history.should.eql(['/', '/user/0']);
        browser.should.have.property('source', '<h1>Tobi</h1><p>the ferret</p>');
        browser.jQuery('p').text().should.equal('the ferret');
        done();
      });
    });
  },

  'test .request(method, foreignUrl)': function(done){
    var browser = tobi.createBrowser(app);
    browser.request('GET', 'http://www.google.com/', {}, function(res, $){
      res.should.have.status(200);
      browser.should.not.have.property('path');
      browser.history.should.be.empty;

      var googBrowser = Browser.browsers['www.google.com']
      googBrowser.should.have.property('path', '/');
      googBrowser.history.should.eql(['/']);
      // googBrowser.jQuery('img[alt="Google"]').length.should.equal(1);
      done();
    });
  },

  'test .request(method, foreignHttpsUrl)': function(done){
    var browser = tobi.createBrowser(app);
    browser.request('GET', 'https://www.github.com/', {}, function(res, $){
      res.should.have.status(200);
      browser.should.not.have.property('path');
      browser.history.should.be.empty;

      var googBrowser = Browser.browsers['github.com']
      googBrowser.should.have.property('path', '/');
      googBrowser.history.should.eql(['/']);
      googBrowser.jQuery('img[alt="github"]').should.not.be.empty;
      done();
    });
  },
  
  'test .request() redirect': function(done){
    var browser = tobi.createBrowser(app);
    browser.request('GET', '/redirect', {}, function(res, $){
      res.should.have.status(200);
      browser.should.have.property('path', '/one');
      browser.history.should.eql(['/redirect', '/one']);
      done();
    });
  },
  
  'test .request() redirect when followRedirects is false': function(done) {
    var browser = tobi.createBrowser(app);
    browser.followRedirects = false;
    browser.request('GET', '/redirect', {}, function(res, $){
      res.should.have.status(302);
      browser.should.have.property('path', '/redirect');
      browser.history.should.eql(['/redirect']);
      done();
    });
  },

  'test .request() redirect to a full uri with different hostname': function(done){
    var browser = tobi.createBrowser(80, 'bit.ly')
    Browser.browsers.should.not.have.property('bit.ly');
    Browser.browsers.should.not.have.property('node.js');
    browser.request('GET', 'http://bit.ly/mQETJ8', {}, function (res, $) {
      res.should.have.status(200);
      Browser.browsers.should.have.property('bit.ly');
      Browser.browsers.should.have.property('nodejs.org');
      var nodeBrowser = Browser.browsers['nodejs.org'];
      nodeBrowser.jQuery('img[alt="node.js"]').length.should.equal(1);
      done();
    });
  },

  'test .request redirecting from a full non-https uri to a https uri': function(done){
    var browser = tobi.createBrowser(80, 'bit.ly')
    browser.request('GET', 'http://bit.ly/jrs5ME', {}, function (res, $) {
      res.should.have.status(200);
      var githubBrowser = Browser.browsers['github.com'];
      githubBrowser.jQuery('#slider .breadcrumb a').should.have.text('tobi');
      done();
    });
  },

  // [!] if this test doesn't pass, an uncaught ECONNREFUSED will be shown
  'test .request() on deferred listen()': function(done){
    var browser = tobi.createBrowser(appDeferred)
      , total = 2;

    function next() {
      appDeferred.close();
      done();
    }

    browser.request('GET', '/', {}, function(res){
      res.should.have.status(200);
      --total || next();
    });

    browser.request('GET', '/', {}, function(res){
      res.should.have.status(200);
      --total || next();
    });
  },
  
  'test .back(fn)': function(done){
    var browser = tobi.createBrowser(app);
    browser.request('GET', '/', {}, function(res, $){
      res.should.have.status(200);
      browser.request('GET', '/user/0', {}, function(){
        browser.back(function(){
          browser.should.have.property('path', '/');
          done();
        });
      });
    });
  },

  'test .head(path)': function(done){
    var browser = tobi.createBrowser(app);
    browser.head('/form', function(res){
      browser.source.should.be.empty;
      done();
    });
  },
  
  'test .post(path)': function(done){
    var browser = tobi.createBrowser(app);
    browser.post('/', function(res, $){
      res.should.have.status(200);
      $('p').should.have.text('POST');
      browser.should.have.property('path', '/');
      browser.history.should.eql(['/']);
      done();
    });
  },
  
  'test .post(path) with passed body': function(done) {
    var browser = tobi.createBrowser(app);
    browser.post('/form', {body: "foo=bar"}, function(res, $){
      res.should.have.status(200);
      res.body.body.should.eql({foo:"bar"});
      browser.should.have.property('path', '/form');
      browser.history.should.eql(['/form']);
      done();
    });
  },
  
  'test .put(path)': function(done){
    var browser = tobi.createBrowser(app);
    browser.put('/', function(res, $){
      res.should.have.status(200);
      $('p').should.have.text('PUT');
      browser.should.have.property('path', '/');
      browser.history.should.eql(['/']);
      done();
    });
  },
  
  'test .delete(path)': function(done){
    var browser = tobi.createBrowser(app);
    browser.delete('/', function(res, $){
      res.should.have.status(200);
      $('p').should.have.text('DELETE');
      browser.should.have.property('path', '/');
      browser.history.should.eql(['/']);
      done();
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
  
  'test .locate(css)': function(){
    var browser = tobi.createBrowser('<ul><li>One</li><li>Two</li></ul>');
    browser.locate('*', 'ul > li').should.have.length(2);
    browser.locate('*', 'li').should.have.length(2);
    browser.locate('*', 'li:last-child').should.have.length(1);
    browser.locate('*', 'li:contains(One)').should.have.length(1);
    browser.locate('ul', ':contains(One)').should.have.length(1);
  },
  
  'test .locate(name)': function(){
    var browser = tobi.createBrowser('<form><p><input name="username" /></p><textarea name="signature"></textarea></form>');
    browser.locate('*', 'username').should.have.length(1);
    browser.locate('*', 'signature').should.have.length(1);
    browser.locate('form > p > input', 'username').should.have.length(1);

    var err;
    try {
      browser.locate('form > p', 'signature').should.have.length(1);
    } catch (e) {
      err = e;
    }
    err.should.have.property('message', 'failed to locate "signature" in context of selector "form > p"');
  },
  
  'test .locate(value)': function(){
    var browser = tobi.createBrowser(
        '<form><p><input type="submit", value="Save" />'
      + '<input type="submit", value="Delete" /></p></form>');
    browser.locate('*', 'Save').should.have.length(1);
    browser.locate('*', 'Delete').should.have.length(1);
    browser.locate('form input', 'Delete').should.have.length(1);
  },
  
  'test .locate(text)': function(){
    var browser = tobi.createBrowser(
        '<div><p>Foo</p>'
      + '<p>Foo</p>'
      + '<p>Bar</p>'
      + '<p>Baz</p></div>');
    browser.locate('*', 'Foo').should.have.length(2);
    browser.locate('*', 'Bar').should.have.length(1);
    browser.locate('*', 'Baz').should.have.length(1);
    browser.locate('div p', 'Foo').should.have.length(2);
    browser.locate('div p', 'Baz').should.have.length(1);
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

  'test .uncheck(name)': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function(res, $){
      res.should.have.status(200);
      $('[name="user[subscribe]"]').should.be.checked;
      browser.uncheck('user[subscribe]');
      $('[name="user[subscribe]"]').should.not.be.checked;
      done();
    });
  },

  'test .check(name)': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function(res, $){
      res.should.have.status(200);
      $('[name="user[agreement]"]').should.not.be.checked;
      browser.check('user[agreement]');
      $('[name="user[agreement]"]').should.be.checked;
      done();
    });
  },

  'test .check(css)': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function(res, $){
      res.should.have.status(200);
      $('[name="user[agreement]"]').should.not.be.checked;
      browser.check('[name="user[agreement]"]');
      $('[name="user[agreement]"]').should.be.checked;
      done();
    });
  },
  
  'test .check(id)': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function(res, $){
      res.should.have.status(200);
      $('[name="user[agreement]"]').should.not.be.checked;
      browser.check('user-agreement');
      $('[name="user[agreement]"]').should.be.checked;
      done();
    });
  },
  
  'test jQuery#click(fn)': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/one', function(res, $){
      res.should.have.status(200);
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
    browser.get('/form', function(res, $){
      res.should.have.status(200);
      $('[name="user[name]"]').val('tjholowaychuk');
      $('[name="user[email]"]').val('tj@vision-media.ca');
      $('[type=submit]').click(function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: 'tjholowaychuk'
            , subscribe: 'yes'
            , signature: ''
            , forum_digest: 'none'
          },
          update: 'Update'
        });
        done();
      });
    });
  },
  
  'test .type()': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function(res, $){
      res.should.have.status(200);
      browser.type('user[name]', 'tjholowaychuk');
      browser.type('user[email]', 'tj@vision-media.ca');
      browser.click('Update', function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: 'tjholowaychuk'
            , subscribe: 'yes'
            , signature: ''
            , forum_digest: 'none'
          },
          update: 'Update'
        });
        done();
      });
    });
  },
  
  'test .type() chaining': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function(res, $){
      res.should.have.status(200);
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
            , subscribe: 'yes'
            , signature: ''
            , forum_digest: 'none'
          },
          update: 'Update'
        });
        done();
      });
    });
  },
  
  'test .fill(obj) names': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function(res, $){
      res.should.have.status(200);
      browser.fill({
          'user[name]': 'tjholowaychuk'
        , 'user[email]': 'tj@vision-media.ca'
        , 'user[agreement]': true
        , 'user[subscribe]': false
        , 'user[display_signature]': 'No'
        , 'user[forum_digest]': 'daily'
        , 'signature': 'TJ Holowaychuk'
      })
      .click('Update', function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: 'tjholowaychuk'
            , agreement: 'yes'
            , signature: 'TJ Holowaychuk'
            , display_signature: 'No'
            , forum_digest: 'daily'
          },
          update: 'Update'
        });
        done();
      });
    });
  },
  
  'test .fill(obj) css': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function(res, $){
      res.should.have.status(200);
      browser.fill({
          'form > #user-name': 'tjholowaychuk'
        , 'form > #user-email': 'tj@vision-media.ca'
        , ':checkbox': true
        , 'user[display_signature]': 'No'
        , '[name="user[forum_digest]"]': 'daily'
        , '#signature': 'TJ Holowaychuk'
      })
      .click(':submit', function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: 'tjholowaychuk'
            , agreement: 'yes'
            , subscribe: 'yes'
            , signature: 'TJ Holowaychuk'
            , display_signature: 'No'
            , forum_digest: 'daily'
          },
          update: 'Update'
        });
        done();
      });
    });
  },
  
  'test jQuery#submit() POST': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function(res, $){
      res.should.have.status(200);
      $('[name="user[name]"]').val('tjholowaychuk');
      $('#signature').val('Wahoo');
       $('form').submit(function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: 'tjholowaychuk'
            , subscribe: 'yes'
            , signature: 'Wahoo'
            , forum_digest: 'none'
          },
          update: 'Update'
        });
        done();
      });
    });
  },

  'test jQuery#submit() POST with a submit input not being a direct descendent':
    function(done){
      var browser = tobi.createBrowser(app);
      browser.get('/form-nested', function(res, $){
        res.should.have.status(200);
        $('[name="user[name]"]').val('tjholowaychuk');
        $('#signature').val('Wahoo');
        $('form').submit(function(res){
          res.body.headers.should.have.property('content-type',
            'application/x-www-form-urlencoded');
          res.body.body.should.eql({
            user: {
                name: 'tjholowaychuk'
              , subscribe: 'yes'
              , signature: 'Wahoo'
              , forum_digest: 'none'
            }
          });
          done();
        });
      });
  },
  
  'test .submit() POST': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function(res, $){
      res.should.have.status(200);
      $('[name="user[name]"]').val('tjholowaychuk');
      $('#signature').val('Wahoo');
       browser.submit('user', function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: 'tjholowaychuk'
            , subscribe: 'yes'
            , signature: 'Wahoo'
            , forum_digest: 'none'
          },
          update: 'Update'
        });
        done();
      });
    });
  },
  
  'test .submit() GET': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/search', function(res, $){
      res.should.have.status(200);
      browser
        .fill({ query: 'ferret hats' })
        .submit(function(res){
          res.body.should.eql({ query: 'ferret hats' });
          done();
        });
    });
  },
  
  'test select single option': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function(res, $){
      res.should.have.status(200);
      $('select option[value=daily]').attr('selected', 'selected');
       browser.submit('user', function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: ''
            , signature: ''
            , subscribe: 'yes'
            , forum_digest: 'daily'
          },
          update: 'Update'
        });
        done();
      });
    });
  },
  
  'test select multiple options': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function(res, $){
      res.should.have.status(200);
      $('select option[value=daily]').attr('selected', 'selected');
      $('select option[value=weekly]').attr('selected', 'selected');
       browser.submit('user', function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: ''
            , signature: ''
            , subscribe: 'yes'
            , forum_digest: ['daily', 'weekly']
          },
          update: 'Update'
        });
        done();
      });
    });
  },
  
  'test .select() single option by value': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function(res, $){
      res.should.have.status(200);
      $('select option[value=daily]').attr('selected', 'selected');
       browser
       .select('user[forum_digest]', 'daily')
       .submit('user', function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: ''
            , signature: ''
            , subscribe: 'yes'
            , forum_digest: 'daily'
          },
          update: 'Update'
        });
        done();
      });
    });
  },
  
  'test .select() multiple options by value': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function(res, $){
      res.should.have.status(200);
      $('select option[value=daily]').attr('selected', 'selected');
       browser
       .select('user[forum_digest]', ['daily', 'weekly'])
       .submit('user', function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: ''
            , signature: ''
            , subscribe: 'yes'
            , forum_digest: ['daily', 'weekly']
          },
          update: 'Update'
        });
        done();
      });
    });
  },
  
  'test .select() multiple options by text': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function(res, $){
      res.should.have.status(200);
      $('select option[value=daily]').attr('selected', 'selected');
       browser
       .select('user[forum_digest]', ['Once per day', 'Once per week'])
       .submit('user', function(res){
        res.body.headers.should.have.property('content-type', 'application/x-www-form-urlencoded');
        res.body.body.should.eql({
          user: {
              name: ''
            , signature: ''
            , subscribe: 'yes'
            , forum_digest: ['daily', 'weekly']
          },
          update: 'Update'
        });
        done();
      });
    });
  },
  
  'test .select() default select option value': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function(res, $){
       browser
       .submit('user', function(res){
        res.body.body.should.eql({
          user: {
              name: ''
            , signature: ''
            , subscribe: 'yes'
            , forum_digest: 'none'
          },
          update: 'Update'
        });
        done();
      });
    });
  },
  
  'test .text()': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/form', function(res, $){
      var txt = browser.text('user[forum_digest]');
      txt.replace(/\s+/g, ' ').trim().should.equal('None Once per day Once per week');
      var txt = browser.text('daily');
      txt.should.equal('Once per day');
      done(); 
    });
  },

  'test setting user-agent': function(done){
    var browser = tobi.createBrowser(80, 'whatsmyuseragent.com');
    browser.get('http://whatsmyuseragent.com', function(res, $){
      res.should.have.status(200);
      $('h4:first').should.have.text('');
      browser.userAgent = 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.100 Safari/534.30';
      browser.get('/', function(res,$){
        res.should.have.status(200);
        $('h4:first').should.have.text('Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.100 Safari/534.30');
        done();
      });
    });
  },
  
  'test JSON link': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/users', function(res, $){
      $('a').click(function(res, obj){
        obj.should.eql([
            { name: 'tobi' }
          , { name: 'loki' }
          , { name: 'jane' }
        ]);
        done();
      });
    });
  },
  
  after: function(){
    app.close();
  }
};
