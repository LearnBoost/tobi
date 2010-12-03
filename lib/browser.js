
/*!
 * Tobi - Browser
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter
  , jsdom = require('jsdom')
  , jquery = require('jquery')
  , http = require('http');

/**
 * Starting portno.
 */

var port = 8888;

/**
 * Initialize a new `Browser` with the given `html` or `server`.
 *
 * @param {String|http.Server} html
 * @api public
 */

var Browser = module.exports = exports = function Browser(html) {
  this.history = [];
  if ('string' == typeof html) {
    this.parse(html);
  } else {
    this.server = html;
    this.server.pending = 0;
    this.server.port = 8888;
  }
};

/**
 * Inherit from `EventEmitter.prototype`.
 */

Browser.prototype.__proto__ = EventEmitter.prototype;

/**
 * Parse the given `html` and populate:
 *
 *   - `.source`
 *   - `.window`
 *   - `.jQuery`
 *
 * @param {String} html
 * @api public
 */

Browser.prototype.parse = function(html){
  this.source = html;
  this.window = jsdom.jsdom(html).createWindow();
  this.jQuery = jquery.create(this.window);
  this.jQuery.browser = this;
  this.context = this.jQuery;
};

/**
 * Request `path` with `method` and callback `fn(jQuery)`.
 *
 * @param {String} path
 * @param {String} method
 * @param {Function} fn
 * @return {Browser} for chaining
 * @api public
 */

Browser.prototype.request = function(method, path, fn, saveHistory){
  var self = this
    , server = this.server
    , host = '127.0.0.1';

  // Ensure server
  if (!server) throw new Error('no .server present');
  ++server.pending;

  // HTTP client
  // TODO: options for headers, request body etc
  if (!server.fd) {
    server.listen(++port, host);
    server.client = http.createClient(port);
  }

  // Save history
  if (false !== saveHistory) this.history.push(path);

  // Request
  var req = server.client.request(method, path, { Host: host });
  req.on('response', function(res){
    --server.pending || server.close();

    var status = res.statusCode
      , buf = '';

    // Success
    if (status >= 200 && status < 300) {
      // TODO: options
      // TODO: ensure html
      res.setEncoding('utf8');
      res.on('data', function(chunk){
        buf += chunk;
      });
      res.on('end', function(){
        self.parse(buf);
        fn(self.jQuery);
      });
    }
  });
  req.end();

  return this;
};

/**
 * GET `path` and callback `fn(jQuery)`.
 *
 * @param {String} path
 * @param {Function} fn
 * @return {Browser} for chaining
 * @api public
 */

Browser.prototype.get = 
Browser.prototype.visit =
Browser.prototype.open = function(path, fn, saveHistory){
  return this.request('GET', path, fn, saveHistory);
};

/**
 * GET the last page visited, or the nth previous page.
 *
 * @param {Number} n
 * @param {Function} fn
 * @return {Browser} for chaining
 * @api public
 */

Browser.prototype.back = function(n, fn){
  if ('function' == typeof n) fn = n, n = 1;
  while (n--) this.history.pop();
  return this.get(this.path, fn, false);
};

/**
 * Locate elements via the given `selector` and `locator` supporting:
 *
 *  - element text
 *  - element name attribute
 *  - css selector
 *
 * @param {String} selector
 * @param {String} locator
 * @return {jQuery}
 * @api public
 */

Browser.prototype.locate = function(selector, locator){
  var $ = this.jQuery;
  return this.context.find(selector).filter(function(elem){
    return locator == $(elem).text()
      || locator == elem.getAttribute('id')
      || locator == elem.getAttribute('name')
      || $(elem.parentNode).find(locator).length;
  });
};

/**
 * Return the current path.
 *
 * @return {String}
 * @api public
 */

Browser.prototype.__defineGetter__('path', function(){
  return this.history[this.history.length - 1];
});

/**
 * Click the given `locator` and callback `fn()`.
 *
 * @param {String} locator
 * @return {Browser} for chaining
 * @api public
 */

Browser.prototype.click = function(locator, fn){
  var $ = this.jQuery
    , elems = this.locate('a', locator);

  // Ensure element(s)
  if (!elems.length) {
    throw new Error('failed to find ' + locator);
  }

  // Grab href
  var href = elems[0].getAttribute('href');
  if (!href) {
    throw new Error('failed to click ' + locator + ', href not present');
  }

  // Re-locate
  return this.get(href, fn);
};

/**
 * Check the checkbox with the given `locator`.
 *
 * @param {String} locator
 * @return {Assertion} for chaining
 * @api public
 */

Browser.prototype.check = function(locator){
  this.locate(':checkbox', locator)[0].setAttribute('checked', 'checked');
  return this;
};

