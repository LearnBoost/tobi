
/*!
 * Tobi - Browser
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter
  , Cookie = require('./cookie')
  , CookieJar = require('./cookie/jar')
  , jsdom = require('jsdom')
  , jQuery = require('../support/jquery')
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
  this.cookieJar = new CookieJar;
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
  this.window = jsdom.jsdom(wrap(html)).createWindow();
  this.jQuery = jQuery.create(this.window);
  this.jQuery.browser = this;
  require('./jquery')(this, this.jQuery);
  this.context = this.jQuery;
};

/**
 * Request `path` with `method` and callback `fn(jQuery)`.
 *
 * @param {String} path
 * @param {String} method
 * @param {Object} options
 * @param {Function} fn
 * @return {Browser} for chaining
 * @api public
 */

Browser.prototype.request = function(method, path, options, fn, saveHistory){
  var self = this
    , server = this.server
    , host = '127.0.0.1'
    , headers = options.headers || {};

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

  // Cookies
  var cookies = this.cookieJar.get({ url: path });
  if (cookies.length) {
    headers.Cookie = cookies.map(function(cookie){
      return cookie.name + '=' + cookie.value;
    }).join('; ');
  }

  // Request
  headers.Host = host;
  var req = server.client.request(method, path, headers);
  req.on('response', function(res){
    var status = res.statusCode
      , buf = '';

    // Cookies
    if (res.headers['set-cookie']) {
      self.cookieJar.add(new Cookie(res.headers['set-cookie']));
    }

    // Success
    if (status >= 200 && status < 300) {
      var contentType = res.headers['content-type'];

      // JSON support
      if (~contentType.indexOf('json')) {
        res.body = '';
        res.on('data', function(chunk){ res.body += chunk; });
        res.on('end', function(){
          try {
            res.body = JSON.parse(res.body);
            fn(res);
          } catch (err) {
            self.emit('error', err);
          }
        });
        return;
      }

      // Ensure html
      if (!~contentType.indexOf('text/html')) {
        return fn(res);
      }

      // Buffer html
      res.setEncoding('utf8');
      res.on('data', function(chunk){ buf += chunk; });
      res.on('end', function(){
        self.parse(buf);
        fn(self.jQuery, res);
      });

    // Redirect
    } else if (status >= 300 && status < 400) {
      var location = res.headers.location;
      self.emit('redirect', location);
      self.request('GET', location, options, fn);

    // Error
    } else {
      var err = new Error(
          method + ' ' + path
        + ' responded with '
        + status + ' "' + http.STATUS_CODES[status] + '"');
      self.emit('error', err);
    }
  });

  req.end(options.body);

  return this;
};

/**
 * GET `path` and callback `fn(jQuery)`.
 *
 * @param {String} path
 * @param {Object|Function} options or fn
 * @param {Function} fn
 * @return {Browser} for chaining
 * @api public
 */

Browser.prototype.get = 
Browser.prototype.visit =
Browser.prototype.open = function(path, options, fn, saveHistory){
  if ('function' == typeof options) {
    saveHistory = fn;
    fn = options;
    options = {};
  }
  return this.request('GET', path, options, fn, saveHistory);
};

/**
 * POST `path` and callback `fn(jQuery)`.
 *
 * @param {String} path
 * @param {Object|Function} options or fn
 * @param {Function} fn
 * @return {Browser} for chaining
 * @api public
 */

Browser.prototype.post = function(path, options, fn, saveHistory){
  if ('function' == typeof options) {
    saveHistory = fn;
    fn = options;
    options = {};
  }
  return this.request('POST', path, options, fn, saveHistory);
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
  var self = this
    , $ = this.jQuery;
  var elems = this.context.find(selector).filter(function(elem){
    return locator == $(elem).text()
      || locator == elem.getAttribute('id')
      || locator == elem.getAttribute('value')
      || locator == elem.getAttribute('name')
      || $(elem).is(locator);
  });
  if (elems && !elems.length) throw new Error('failed to locate "' + locator + '" in context of selector "' + selector + '"');
  return elems;
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
 * Click the given `locator` and callback `fn(res)`.
 *
 * @param {String} locator
 * @param {Function} fn
 * @return {Browser} for chaining
 * @api public
 */

Browser.prototype.click = function(locator, fn){
  return this.jQuery(this.locate(':submit, :button, a', locator)).click(fn, locator);
};

/**
 * Submit form at the given `locator` and callback `fn(res)`.
 *
 * @param {String} locator
 * @param {Function} fn
 * @return {Browser} for chaining
 * @api public
 */

Browser.prototype.submit = function(locator, fn){
  return this.jQuery(this.locate('form', locator)).submit(fn, locator);
};

/**
 * Assign `val` to the given `locator`.
 *
 * @param {String} locator
 * @param {String} val
 * @return {Browser} for chaining
 * @api public
 */

Browser.prototype.type = function(locator, val){
  this.jQuery(this.locate('input, textarea', locator)).val(val);
  return this;
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

/**
 * Select `options` at `locator`.
 *
 * @param {String} locator
 * @param {String|Array} select
 * @return {Assertion} for chaining
 * @api public
 */

Browser.prototype.select = function(locator, options){
  this.jQuery(this.locate('select', locator)).select(options);
  return this;
};

/**
 * Fill the given form `fields`.
 *
 * @param {Object} fields
 * @return {Assertion} for chaining
 * @api public
 */

Browser.prototype.fill = function(locator, fields){
  this.jQuery(this.locate('form', locator)).fill(fields);
  return this;
};

/**
 * Ensure `html` / `body` tags exist.
 *
 * @return {String}
 * @api public
 */

function wrap(html) {
  // body
  if (!~html.indexOf('<body')) {
    html = '<body>' + html + '</body>';
  }

  // html
  if (!~html.indexOf('<html')) {
    html = '<html>' + html + '</html>';
  }

  return html;
}