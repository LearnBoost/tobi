
/**
 * Module dependencies.
 */

var tobi = require('tobi')
  , should = require('should');

module.exports = {
  'test .version': function(){
    tobi.version.should.match(/^\d+\.\d+\.\d+$/);
  }
};