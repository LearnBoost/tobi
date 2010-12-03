
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
    should.equal(e, msg);
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

module.exports = {
  'test .text()': function(done){
    browser.get('/user/1', function($){
      $('p').prev().should.have.text('Tobi');
      $('p').prev().should.have.text(/^To/);
      
      err(function(){
        $('p').prev().should.not.have.text('Tobi');
      }, "expected [jQuery 'p'] to not have text 'Tobi'");

      err(function(){
        $('p').prev().should.have.text('Raul');
      }, "expected [jQuery 'p'] to have text 'Raul'");

      done();
    });
  }
};