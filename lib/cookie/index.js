
/*!
 * Tobi - Cookie
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Initialize a new `Cookie` with the given cookie `str`.
 *
 * @param {String} str
 * @api private
 */

var Cookie = exports = module.exports = function Cookie(str) {
  this.str = str;
};

/**
 * Return the original cookie string.
 *
 * @return {String}
 * @api public
 */

Cookie.prototype.toString = function(){
  return this.str;
};
