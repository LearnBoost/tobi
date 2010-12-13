
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

app.get('/script', function(req, res, next){
  res.send('<script>document.getElementById("para").innerHTML = "<em>new</em>";</script><p id="para">old</p>');
});

module.exports = {
  'test external option disabled': function(done){
    var browser = tobi.createBrowser(app);
    browser.get('/script', function(res, $){
      res.should.have.status(200);
      $('p').should.have.text('old');
      done();
    });
  },
  
  'test external option enabled': function(done){
    var browser = tobi.createBrowser(app, { external: true });
    browser.get('/script', function(res, $){
      res.should.have.status(200);
      $('p').should.have.text('new');
      done();
    });
  },
  
  after: function(){
    app.close();
  }
};