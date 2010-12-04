
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

  // First key is the name
  this.name = str.substr(0, str.indexOf('='));

  // Map the key/val pairs
  str.split(/ *; */).reduce(function(obj, pair){
    pair = pair.split(/ *= */);
    obj[pair[0]] = pair[1] || true;
    return obj;
  }, this);

  // Assign value
  this.value = this[this.name];
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
