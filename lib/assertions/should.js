
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
    , 'expected ' + j(elem) + ' to have many ' + i(selector) + ' tags, but has ' + n(len)
    , 'expected ' + j(elem) + ' to not have many ' + i(selector) + ' tags, but has ' + n(len));

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

/**
 * Assert existance attr `key` with optional `val`.
 *
 * @param {String} key
 * @param {String} val
 * @return {Assertion} for chaining
 * @api public
 */

Assertion.prototype.attr = function(key, val){
  var elem = this.obj
    , attr = elem.get(0).getAttribute(key);

  if (!val || (val && !this.negate)) {
    this.assert(
        attr.length
      , 'expected ' + j(elem) + ' to have attribute ' + i(key)
      , 'expected ' + j(elem) + ' to not have attribute ' + i(key) + ', but has ' + i(attr));
  }

  if (val) {
    this.assert(
        val == attr
      , 'expected ' + j(elem) + ' to have attribute ' + i(key) + ' with ' + i(val) + ', but has ' + i(attr)
      , 'expected ' + j(elem) + ' to not have attribute ' + i(key) + ' with ' + i(val));
  }

  return this;
};

/**
 * Assert presence of the given class `name`.
 *
 * @param {String} name
 * @return {Assertion} for chaining
 * @api public
 */

Assertion.prototype.class = function(name){
  var elem = this.obj
    , classes = elem.get(0).getAttribute('class').split(/ +/);

  this.assert(
      ~classes.indexOf(name)
    , 'expected ' + j(elem) + ' to have class ' + i(name) + ', but has ' + i(classes.join(' '))
    , 'expected ' + j(elem) + ' to not have class ' + i(name));

  return this;
};

/**
 * Assert enabled.
 *
 * @return {Assertion} for chaining
 * @api public
 */

Assertion.prototype.__defineGetter__('enabled', function(){
  var elem = this.obj
    , disabled = elem.get(0).getAttribute('disabled');

  this.assert(
      !disabled
    , 'expected ' + j(elem) + ' to be enabled'
    , '<not implemented, use .disabled>');

  return this;
});

/**
 * Assert disabled.
 *
 * @return {Assertion} for chaining
 * @api public
 */

Assertion.prototype.__defineGetter__('disabled', function(){
  var elem = this.obj
    , disabled = elem.get(0).getAttribute('disabled');

  this.assert(
      disabled
    , 'expected ' + j(elem) + ' to be disabled'
    , '<not implemented, use .enabled>');

  return this;
});

/**
 * Assert checked or unchecked.
 *
 * @return {Assertion} for chaining
 * @api public
 */

Assertion.prototype.__defineGetter__('checked', function(){
  var elem = this.obj
    , checked = elem.get(0).getAttribute('checked');

  this.assert(
      'checked' == checked
    , 'expected ' + j(elem) + ' to be checked'
    , 'expected ' + j(elem) + ' to be unchecked');

  return this;
});
