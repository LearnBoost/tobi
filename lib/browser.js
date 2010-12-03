
/*!
 * Chrono - Browser
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter
  , jsdom = require('jsdom')
  , jquery = require('jquery');

/**
 * Initialize a new `Browser` with the given `html` or `server`.
 *
 * @param {String|http.Server} html
 * @api public
 */

var Browser = module.exports = exports = function Browser(html) {
  this.history = [];
  if ('string' == typeof html) {
    this.parse(html);
  } else {
    this.server = html;
  }
};

/**
 * Inherit from `EventEmitter.prototype`.
 */

Browser.prototype.__proto__ = EventEmitter.prototype;

/**
 * Parse the given `html` and populate:
 *
 *   - `.source`
 *   - `.window`
 *   - `.jQuery`
 *
 * @param {String} html
 * @api public
 */

Browser.prototype.parse = function(html){
  this.source = html;
  this.window = jsdom.jsdom(html).createWindow();
  this.jQuery = jquery.create(this.window);
};

/**
 * Open `path` and callback `fn()`.
 *
 * @param {String} path
 * @param {Function} fn
 * @return {Browser} for chaining
 * @api public
 */

Browser.prototype.open = function(path, fn){
  this.history.push(path);
  fn();
  return this;
};

/**
 * Return the current path.
 *
 * @return {String}
 * @api public
 */

Browser.prototype.__defineGetter__('path', function(){
  return this.history[this.history.length - 1];
});
