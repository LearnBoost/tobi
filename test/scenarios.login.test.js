
/**
 * Module dependencies.
 */

var tobi = require('tobi')
  , express = require('express')
  , should = require('should');

// Test app

var app = express.createServer();

app.use(express.bodyDecoder());

app.get('/form', function(req, res){
  res.send('<form id="user" action="/form">'
    + '<input type="text" name="user[name]" />'
    + '<input type="text" name="user[email]" disabled="disabled" />'
    + '<input type="checkbox" name="user[agreement]" id="user-agreement" value="yes" />'
    + '<input type="submit" value="Update" />'
    + '<fieldset>'
    + '  <textarea id="signature" name="user[signature]"></textarea>'
    + '</fieldset>'
    + '</form>');
});

app.post('/form', function(req, res){
  res.send({ headers: req.headers, body: req.body });
});

module.exports = {

};