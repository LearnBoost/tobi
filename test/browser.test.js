
/**
 * Module dependencies.
 */

var chrono = require('chrono')
  , Browser = chrono.Browser
  , should = require('should');

module.exports = {
  'test Browser(str)': function(){
    var html = '<ul><li>one</li><li>two</li></ul>'
      , browser = new Browser(html);
    browser.should.have.property('source', html);
    browser.should.have.property('window');
    browser.should.have.property('jQuery');
  },
  
  'test .createBrowser(str)': function(){
    var html = '<ul><li>one</li><li>two</li></ul>'
      , browser = chrono.createBrowser(html);
    browser.should.have.property('source', html);
  }
};