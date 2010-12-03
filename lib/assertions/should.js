
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
 *
 * @param {String} selector
 * @return {Assertion} for chaining
 * @api public
 */

Assertion.prototype.many = function(selector){
  var elem = this.obj
    , elems = elem.find(selector);
  
  this.assert(
      elems.length
    , 'expected ' + j(elem) + ' to have many ' + i(selector) + ' tags, but has none'
    , '<not implemented>');

  return this;
};