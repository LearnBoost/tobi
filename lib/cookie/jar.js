
/*!
 * Tobi - CookieJar
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var url = require('url');

/**
 * Initialize a new `CookieJar`.
 *
 * @api private
 */

var CookieJar = exports = module.exports = function CookieJar() {
  this.cookies = [];
};

/**
 * Add the given `cookie` to the jar.
 *
 * @param {Cookie} cookie
 * @api public
 */

CookieJar.prototype.add = function(cookie){
  this.cookies.push(cookie);
};

CookieJar.prototype.get = function(req){
  var path = url.parse(req.url).pathname
    , now = new Date;
  return this.cookies.filter(function(cookie){
    return 0 == path.indexOf(cookie.path)
      && now < cookie.expires;
  });
};

