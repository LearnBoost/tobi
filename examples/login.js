
// Expose support modules

require.paths.unshift(__dirname + '/../support');

/**
 * Module dependencies.
 */

var app = require('./app')
  , tobi = require('../')
  , should = require('should')
  , browser = tobi.createBrowser(app);

browser.get('/login', function($){
  $('form')
    .should.have.action('/login')
    .and.have.method('post')
    .and.have.many('input');
  
  $('form > input[name=username]').should.have.attr('type', 'text');
  $('form > input[name=password]').should.have.attr('type', 'password');
  $('form :submit').should.have.value('Login');
});

browser.get('/login', function(){
  browser.fill({
      username: 'tj'
    , password: 'tobi'
  }).click('Login', function($, res){
    res.statusCode.should.equal(200)
    $('ul.messages').should.have.one('li', 'Successfully authenticated');
    console.log('Testing complete');
  })
});
