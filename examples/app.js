
/**
 * Module dependencies.
 */

var express = require('express')
  , MemoryStore = require('connect').session.MemoryStore;

/**
 * Setup app.
 */

var app = module.exports = express.createServer(
    express.bodyDecoder()
  , express.cookieDecoder()
  , express.session({ store: new MemoryStore({ reapInterval: -1 })})
);

/**
 * Display login form.
 */

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

/**
 * Authenticate user.
 */

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