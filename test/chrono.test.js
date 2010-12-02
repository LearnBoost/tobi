
/**
 * Module dependencies.
 */

var chrono = require('chrono')
  , should = require('should');

module.exports = {
  'test .version': function(){
    chrono.version.should.match(/^\d+\.\d+\.\d+$/);
  }
};