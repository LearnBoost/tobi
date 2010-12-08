
/**
 * Module dependencies.
 */

var tobi = require('tobi')
  , express = require('express')
  , connect = require('connect')
  , should = require('should')
  , MemoryStore = connect.session.MemoryStore;

// Test app

var app = express.createServer()
  , store = new MemoryStore({ reapInterval: -1 });

app.use(express.bodyDecoder());
app.use(express.cookieDecoder());
app.use(express.session({ store: store }));

app.get('/login', function(req, res){
  var msgs = req.flash('info');
  res.send(
      (msgs.length ? '<ul class="messages"><li>' + msgs[0] + '</li></ul>' : '')
    + '<form id="user" action="/login" method="post">'
    + '  <input type="text" name="username" />'
    + '  <input type="password" name="password" />'
    + '  <input type="submit" value="Login" />'
    + '</form>');
});

app.post('/login', function(req, res){
  var username = req.body.username
    , password = req.body.password;
  
  // Fake authentication / validation
  if ('tj' == username && 'tobi' == password) {
    req.flash('info', 'Successfully authenticated');
  } else if (!username) {
    req.flash('info', 'Username required');
  } else if (!password) {
    req.flash('info', 'Password required');
  } else {
    req.flash('info', 'Authentication failed');
  }

  res.redirect('/login');
});

var browser = tobi.createBrowser(app);

module.exports = {
  'test /login with valid credentials': function(done){
    browser.get('/login', function(res, $){
      $('form')
        .fill({ username: 'tj', password: 'tobi' })
        .submit(function(res, $){
          res.should.have.status(200);
          $('ul.messages').should.have.one('li', 'Successfully authenticated');
          done();
        });
    });
  },
  
  'test /login with invalid credentials': function(done){
    browser.get('/login', function(res, $){
      $('form')
        .fill({ username: 'tj', password: 'foobar' })
        .find(':submit')
        .click(function(res, $){
          res.should.have.status(200);
          res.should.have.header('X-Powered-By', 'Express');
          $('ul.messages').should.have.one('li', 'Authentication failed');
          done();
        });
    });
  },
  
  'test /login with username omitted': function(done){
    browser.get('/login', function(){
      browser
      .type('password', 'not tobi')
      .submit('form', function(res, $){
        res.should.have.status(200);
        $('ul.messages').should.have.one('li', 'Username required');
        done();
      })
    });
  },
  
  after: function(){
    app.close();
  }
};