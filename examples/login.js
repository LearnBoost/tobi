
// Expose support modules

require.paths.unshift(__dirname + '/../support');

/**
 * Module dependencies.
 */

var app = require('./app')
  , tobi = require('../')
  , should = require('should')
  , browser = tobi.createBrowser(app);

browser.get('/login', function(){
  browser.fill({
      username: 'tj'
    , password: 'tobi'
  }).click('Login', function($, res){
    res.statusCode.should.equal(200)
    $('ul.messages').should.have.one('li', 'Successfully authenticated');
  })
});