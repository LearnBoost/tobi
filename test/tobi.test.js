
/**
 * Module dependencies.
 */

var tobi = require('../')
  , should = require('should');

module.exports = {
  'test .version': function(){
    tobi.version.should.match(/^\d+\.\d+\.\d+$/);
  }
};