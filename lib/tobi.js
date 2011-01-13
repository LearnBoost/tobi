
/*!
 * Tobi
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Library version.
 */

exports.version = '0.1.1';

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

exports.createBrowser = function(a,b,c){
  return new exports.Browser(a,b,c);
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
