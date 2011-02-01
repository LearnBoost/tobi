
/**
 * Module dependencies.
 */

var tobi = require('../')
  , should = require('should')
  , browser = tobi.createBrowser(80, 'google.com');

browser.get('/', function(res){
  res.should.have.status(200);
  browser.click("input[name=btnG]", function(res, $){
    $('title').should.have.text('Google');
  });
});