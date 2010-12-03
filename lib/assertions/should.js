
/*!
 * Tobi - assertions - should
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Assertion = require('should').Assertion;

/**
 * Assert text as `str`.
 *
 * @param {String} str
 * @return {Assertion} for chaining
 * @api public
 */

Assertion.prototype.text = function(str){
  this.obj.text().should.equal(str);
  return this;
};