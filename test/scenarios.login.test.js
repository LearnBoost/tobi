
/**
 * Module dependencies.
 */

var tobi = require('tobi')
  , express = require('express')
  , connect = require('connect')
  , should = require('should')
  , MemoryStore = connect.session.MemoryStore;

// Test app

var app = express.createServer();

app.use(express.bodyDecoder());
app.use(express.cookieDecoder());
app.use(express.session({ store: new MemoryStore({ reapInterval: -1 }) }));

app.get('/login', function(req, res){
  var msgs = req.flash('info');
  res.send(
      msgs.length ? '<ul class="messages"><li>' + msgs[0] + '</li></ul>' : ''
    + '<form id="user" action="/login" method="post">'
    + '  <input type="text" name="username" />'
    + '  <input type="password" name="password" />'
    + '  <input type="submit" value="Login" />'
    + '</form>');
});

app.post('/login', function(req, res){
  var username = req.body.username
    , password = req.body.password;
  
  // Fake authentication
  if ('tj' == username && 'tobi' == password) {
    req.flash('info', 'Successfully authenticated');
  } else {
    req.flash('info', 'Authentication failed');
  }

  res.redirect('/login');
});

var browser = tobi.createBrowser(app);

module.exports = {
  'test /login with valid credentials': function(done){
    browser.get('/login', function(){
      browser.fill({
          username: 'tj'
        , password: 'tobi'
      }).click('Login', function($, res){
        res.statusCode.should.equal(200);
        console.log(browser.source);
        done();
      })
    });
  }
};