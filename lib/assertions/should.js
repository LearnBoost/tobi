
/*!
 * Tobi - assertions - should
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Assertion = require('should').Assertion
  , i = require('sys').inspect;

/**
 * Assert text as `str` or a `RegExp`.
 *
 * @param {String|RegExp} str
 * @return {Assertion} for chaining
 * @api public
 */

Assertion.prototype.text = function(str){
  var text = this.obj.text()
    , elem = '[jQuery ' + i(this.obj.selector) + ']';

  if (str instanceof RegExp) {
    this.assert(
        str.test(text)
      , 'expected ' + elem + ' to have text matching ' + i(str)
      , 'expected ' + elem + ' text ' + i(text) + ' to not match ' + i(str));
  } else {
    this.assert(
        str == text
      , 'expected ' + elem + ' to have text ' + i(str)
      , 'expected ' + elem + ' to not have text ' + i(str));
  }

  return this;
};