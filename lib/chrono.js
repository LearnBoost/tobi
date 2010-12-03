
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
 * Initialize a new `Browser`.
 */

exports.createBrowser = function(str){
  return new exports.Browser(str);
};