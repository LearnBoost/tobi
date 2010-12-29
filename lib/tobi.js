
/*!
 * Tobi
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Library version.
 */

exports.version = '0.0.8';

/**
 * Expose `Browser`.
 */

exports.Browser = require('./browser');

/**
 * Expose `Cookie`.
 */

exports.Cookie = require('./cookie');

/**
 * Expose `CookieJar`.
 */

exports.CookieJar = require('./cookie/jar');

/**
 * Initialize a new `Browser`.
 */

exports.createBrowser = function(str, options){
  return new exports.Browser(str, options);
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
