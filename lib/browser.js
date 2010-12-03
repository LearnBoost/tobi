
/*!
 * Chrono - Browser
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var jsdom = require('jsdom')
  , jquery = require('jquery');

/**
 * Initialize a new `Browser` with the given `html` or `server`.
 *
 * @param {String|http.Server} html
 * @api public
 */

var Browser = module.exports = exports = function Browser(html) {
  if ('string' == typeof html) {
    this.parse(html);
  } else {
    this.server = html;
  }
};

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
