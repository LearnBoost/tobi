
/*!
 * Tobi
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
 * Expose `Cookie`.
 */

exports.Cookie = require('./cookie');

/**
 * Initialize a new `Browser`.
 */

exports.createBrowser = function(str){
  return new exports.Browser(str);
};

/**
 * Automated should.js support.
 */

try {
  require('should');
  require('./assertions/should');
} catch (err) {
  // Ignore
}