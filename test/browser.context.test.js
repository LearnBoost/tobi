
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

app.get('/search', function(req, res){
  res.send(
      '<form id="user-search" action="/search/users">'
    + '  <input type="text" name="query" />'
    + '</form>'
    + '<form id="post-search" action="/search/posts">'
    + '  <input type="text" name="query" />'
    + '</form>');
});

app.post('/search/users', function(req, res){
  res.send({ users: true, headers: req.headers, body: req.body });
});

app.post('/search/posts', function(req, res){
  res.send({ posts: true, headers: req.headers, body: req.body });
});

module.exports = {
  'test ': function(){
    
  },
  
  after: function(){
    app.close();
  }
};