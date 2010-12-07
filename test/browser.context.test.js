
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
      '<form id="user-search" method="post" action="/search/users">'
    + '  <input type="text" name="query" />'
    + '</form>'
    + '<form id="post-search" method="post" action="/search/posts">'
    + '  <input type="text" name="query" />'
    + '</form>');
});

app.post('/search/users', function(req, res){
  res.send({ users: true, headers: req.headers, body: req.body });
});

app.post('/search/posts', function(req, res){
  res.send({ posts: true, headers: req.headers, body: req.body });
});

var browser = tobi.createBrowser(app);

module.exports = {
  'test global context': function(done){
    browser.get('/search', function($){
      $('form').should.have.length(2);
      browser
      .type('query', 'foo bar')
      .submit(function(res){
        res.body.users.should.be.true;
        res.body.body.should.eql({ query: 'foo bar' });
        done();
      });
    });
  },
  after: function(){
    app.close();
  }
};