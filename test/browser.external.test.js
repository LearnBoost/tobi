
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

app.get('/remote/script.js', function(req, res){
  res.header('Content-Type', 'application/javascript');
  res.send('document.getElementById("para").innerHTML = "<em>new</em>";');
});

app.get('/remote', function(req, res){
  res.send('<html><head><script src="/remote/script.js"></script></head><body><p>old</p></body></html>')
});

app.get('/script', function(req, res){
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
  
  // 'test remote scripts': function(done){
  //   var browser = tobi.createBrowser(app, { external: true });
  //   browser.get('/remote', function(res, $){
  //     res.should.have.status(200);
  //     $('p').should.have.text('new');
  //     done();
  //   });
  // },
  
  after: function(){
    app.close();
  }
};