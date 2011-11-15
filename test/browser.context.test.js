
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

app.get('/search', function(req, res){
  res.send(
      '<div><form id="user-search" method="post" action="/search/users">'
    + '  <input type="text" name="query" />'
    + '</form></div>'
    + '<div><form id="post-search" method="post" action="/search/posts">'
    + '  <input type="text" name="query" />'
    + '</form></div>');
});

app.post('/search/users', function(req, res){
  res.send({ users: true, headers: req.headers, body: req.body });
});

app.post('/search/posts', function(req, res){
  res.send({ posts: true, headers: req.headers, body: req.body });
});

module.exports = {
  'test global context': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/search', function(res, $){
      $('form').should.have.length(2);
      browser
      .type('query', 'foo bar')
      .submit(function(res){
        res.body.should.have.property('users', true);
        res.body.body.should.eql({ query: 'foo bar' });
        done();
      });
    });
  },
  
  'test custom context': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/search', function(res, $){
      $('form').should.have.length(2);
      browser.within('div:nth-child(2)', function(){
        $('> form').should.have.length(1);
        $('> input').should.have.length(0);

        browser.within('form', function(){
          $('> form').should.have.length(0);
          $('> input').should.have.length(1);
        });

        $('> form').should.have.length(1);
        $('> input').should.have.length(0);

        browser
        .type('query', 'foo bar')
        .submit(function(res){
          res.body.should.have.property('posts', true);
          res.body.body.should.eql({ query: 'foo bar' });
          done();
        });
      });
      $('form').should.have.length(2);
    });
  },

  after: function(){
    app.close();
  }
};