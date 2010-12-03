
/**
 * Module dependencies.
 */

var tobi = require('tobi')
  , express = require('express')
  , should = require('should');

// Assert error

function err(fn, msg){
  var err;
  try {
    fn();
  } catch (e) {
    should.equal(e.message, msg);
    return;
  }
  throw new Error('no exception thrown, expected "' + msg + '"');
}

// Test app

var app = express.createServer()
  , browser = tobi.createBrowser(app);

app.get('/user/:id', function(req, res){
  res.send('<h1 id="title">Tobi</h1><p>the ferret</p>');
});

app.get('/list', function(req, res){
  res.send('<ul><li>one</li><li>two</li><li><em>three<em></li></ul>');
});

// Tests

exports['test .text()'] = function(done){
  browser.get('/user/1', function($){
    $('p').prev().should.have.text('Tobi');
    $('p').prev().should.have.text(/^To/);
    
    err(function(){
      $('h1').should.not.have.text('Tobi');
    }, "expected [jQuery 'h1'] to not have text 'Tobi'");

    err(function(){
      $('h1').should.have.text('Raul');
    }, "expected [jQuery 'h1'] to have text 'Raul'");
    
    err(function(){
      $('h1').should.have.text(/^Raul/);
    }, "expected [jQuery 'h1'] to have text matching /^Raul/");
    
    err(function(){
      $('h1').should.not.have.text(/^To/);
    }, "expected [jQuery 'h1'] text 'Tobi' to not match /^To/");

    done();
  });
};

exports['test .many()'] = function(done){
  browser.get('/list', function($){
    $('ul').should.have.many('li');
    $('ul').should.not.have.many('rawr');
    $('ul').should.not.have.many('em');
    
    err(function(){
      $('ul').should.have.many('p');
    }, "expected [jQuery 'ul'] to have many 'p' tags, but has none");

    err(function(){
      $('ul').should.have.many('em');
    }, "expected [jQuery 'ul'] to have many 'em' tags, but has one");

    err(function(){
      $('ul').should.not.have.many('li');
    }, "expected [jQuery 'ul'] to not have many 'li' tags, but has 3");
    
    done();
  });
};
