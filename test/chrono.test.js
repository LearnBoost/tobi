
/**
 * Module dependencies.
 */

var chrono = require('chrono');

module.exports = {
  'test .version': function(assert){
    assert.match(chrono.version, /^\d+\.\d+\.\d+$/);
  }
};