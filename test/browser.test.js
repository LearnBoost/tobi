
/**
 * Module dependencies.
 */

var tobi = require('tobi')
  , express = require('express')
  , Browser = tobi.Browser
  , should = require('should');

var app = express.createServer();

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
      , browser = tobi.createBrowser(html);
    browser.should.have.property('source', html);
  },

  'test .createBrowser(str) with <html> but no <body>': function(){
    var html = '<html><p>loki</p></html>'
      , browser = tobi.createBrowser(html);
    browser.should.have.property('source', html);
  },
  
  'test .createBrowser(server)': function(){
    var browser = tobi.createBrowser(app);
    browser.should.have.property('server', app);
  }
};
