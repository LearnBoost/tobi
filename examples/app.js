
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
      (msgs.length ? '<ul class="messages"><li>' + msgs[0] + '</li></ul>'
        : req.session.user
          ? '<ul class="messages"><li>Already authenticated</li></ul>'
          : '')
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
    req.session.user = { name: 'tj' };
  } else if (!username) {
    req.flash('info', 'Username required');
  } else if (!password) {
    req.flash('info', 'Password required');
  } else {
    req.flash('info', 'Authentication failed');
  }

  res.redirect('/login');
});

var wizard = [
  {
    show: function(req, res){
      res.send('<h1>Account</h1>'
        + '<form method="post" action="/wizard/page/0">'
        + '  Username: <input type="text" name="name" />'
        + '  Email: <input type="text" name="email" />'
        + '  <input type="submit" value="Continue" />'
        + '</form>');
    },
    
    post: function(req, res){
      req.session.wizard = req.body;
      res.redirect('/wizard/page/1');
    }
  },
  
  {
    show: function(req, res){
      res.send('<h1>Details</h1>'
        + '<form method="post" action="/wizard/page/1">'
        + '  <select name="city">'
        + '    <option value="edmonton">Edmonton</option>'
        + '    <option value="victoria">Victoria</option>'
        + '    <option value="naniamo">Naniamo</option>'
        + '    <option value="other">Other</option>'
        + '  </select>'
        + '  <input type="submit" value="Continue" />'
        + '</form>');
    },
    
    post: function(req, res){
      req.session.wizard.city = req.body.city;
      res.redirect('/wizard/page/2');
    }
  },
  
  {
    show: function(req, res){
      var data = req.session.wizard;
      res.send('<h1>Review</h1>'
        + '<form method="post" action="/wizard/page/2">'
        + '  <ul>'
        + '    <li>Name: ' + data.name + '</li>'
        + '    <li>Email: ' + data.email + '</li>'
        + '    <li>City: ' + data.city + '</li>'
        + '  </ul>'
        + '  <input type="submit" value="Complete" />'
        + '</form>');
    },
    
    post: function(req, res){
      var data = req.session.wizard;
      res.send('<h1>Registration Complete</h1>'
        + '<p>Registration was completed with the following info:</p>'
        + '<ul>'
        + '  <li>Name: ' + data.name + '</li>'
        + '  <li>Email: ' + data.email + '</li>'
        + '  <li>City: ' + data.city + '</li>'
        + '</ul>');
    }
  }
];

app.get('/wizard', function(req, res){
  res.redirect('/wizard/page/0');
});

app.get('/wizard/page/:page', function(req, res){
  wizard[req.params.page].show(req, res);
});

app.post('/wizard/page/:page', function(req, res){
  wizard[req.params.page].post(req, res);
});

// Only listen on $ node app.js

if (!module.parent) app.listen(3000);