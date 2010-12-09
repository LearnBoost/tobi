
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
 * @api private
 */

CookieJar.prototype.add = function(cookie){
  for (var i = 0, len = this.cookies.length; i < len; ++i) {
    if (cookie.name == this.cookies[i].name
      && cookie.value == this.cookies[i].value) {
      this.cookies.splice(i, 1);
    }
  }
  this.cookies.push(cookie);
};

/**
 * Get cookies for the given `req`.
 *
 * @param {IncomingRequest} req
 * @return {Array}
 * @api private
 */

CookieJar.prototype.get = function(req){
  var path = url.parse(req.url).pathname
    , now = new Date;
  return this.cookies.filter(function(cookie){
    return 0 == path.indexOf(cookie.path)
      && now < cookie.expires;
  });
};

/**
 * Return Cookie string for the given `req`.
 *
 * @param {IncomingRequest} req
 * @return {String}
 * @api private
 */

CookieJar.prototype.cookieString = function(req){
  var cookies = this.get(req);
  if (cookies.length) {
    return cookies.map(function(cookie){
      return cookie.name + '=' + cookie.value;
    }).join('; ');
  }
};
