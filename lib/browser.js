
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
 * Initialize a new `Browser` with the given `html`.
 *
 * @param {String} html
 * @api public
 */

var Browser = module.exports = exports = function Browser(html) {
  this.source = html;
  this.window = jsdom.jsdom(html).createWindow();
  this.jQuery = jquery.create(this.window);
};