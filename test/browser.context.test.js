
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

app.get('/form', function(req, res){
  res.send('<form id="user" method="post">'
    + '<input id="user-name" type="text" name="user[name]" />'
    + '<input id="user-email" type="text" name="user[email]" disabled="disabled" />'
    + '<input type="checkbox" name="user[agreement]" id="user-agreement" value="yes" />'
    + '<input type="checkbox" name="user[subscribe]" checked="checked" value="yes" />'
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
  'test ': function(){
    
  },
  
  after: function(){
    app.close();
  }
};