
/*!
 * Tobi - assertions - should
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Assertion = require('should').Assertion
  , j = function(elem){ return '[jQuery ' + i(elem.selector) + ']'; }
  , i = require('sys').inspect;

/**
 * Number strings.
 */

var nums = { 0: 'none', 1: 'one', 2: 'two', 3: 'three' };

/**
 * Return string representation for `n`.
 *
 * @param {Number} n
 * @return {String}
 * @api private
 */

function n(n) {
  return nums[n] || n;
}

/**
 * Assert text as `str` or a `RegExp`.
 *
 * @param {String|RegExp} str
 * @return {Assertion} for chaining
 * @api public
 */

Assertion.prototype.text = function(str){
  var elem = this.obj
    , text = elem.text();

  if (str instanceof RegExp) {
    this.assert(
        str.test(text)
      , 'expected ' + j(elem)+ ' to have text matching ' + i(str)
      , 'expected ' + j(elem) + ' text ' + i(text) + ' to not match ' + i(str));
  } else {
    this.assert(
        str == text
      , 'expected ' + j(elem) + ' to have text ' + i(str)
      , 'expected ' + j(elem) + ' to not have text ' + i(str));
  }

  return this;
};

/**
 * Assert that many child elements are present via `selector`.
 * When negated, <= 1 is a valid length.
 *
 * @param {String} selector
 * @return {Assertion} for chaining
 * @api public
 */

Assertion.prototype.many = function(selector){
  var elem = this.obj
    , elems = elem.find(selector)
    , len = elems.length;

  this.assert(
      this.negate ? len > 1 : len
    , 'expected ' + j(elem) + ' to have many ' + i(selector) + ' tags, but has none'
    , 'expected ' + j(elem) + ' to not have many ' + i(selector) + ' tags, but has '
      + (1 == len ? 'one' : len));

  return this;
};

/**
 * Assert that one child element is present via `selector`.
 *
 * @param {String} selector
 * @return {Assertion} for chaining
 * @api public
 */

Assertion.prototype.one = function(selector){
  var elem = this.obj
    , elems = elem.find(selector)
    , len = elems.length;

  this.assert(
      1 == len
    , 'expected ' + j(elem) + ' to have one ' + i(selector) + ' tag, but has ' + n(len)
    , 'expected ' + j(elem) + ' to not have one ' + i(selector) + ' tag, but has ' + n(len));

  return this;
};