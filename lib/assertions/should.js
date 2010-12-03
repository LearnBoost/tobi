
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
 * Assert text as `str` or a `RegExp`.
 *
 * @param {String|RegExp} str
 * @return {Assertion} for chaining
 * @api public
 */

Assertion.prototype.text = function(str){
  if (str instanceof RegExp) {
    this.obj.text().should.match(str);
  } else {
    this.obj.text().should.equal(str);
  }
  return this;
};