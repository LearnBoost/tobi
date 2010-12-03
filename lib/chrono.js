
/*!
 * Chrono
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Library version.
 */

exports.version = '0.0.1';

/**
 * Expose `Browser`.
 */

exports.Browser = require('./browser');

/**
 * Initialize a new `Browser` with the given `html`.
 *
 * @param {String} html
 * @return {Browser}
 * @api public
 */

exports.createBrowser = function(html){
  return new exports.Browser(html);
};