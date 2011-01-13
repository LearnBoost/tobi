
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
  , jQuery = require('./jquery/core')
  , http = require('http');

/**
 * Starting portno.
 */

var startingPort = 9000;

/**
 * Initialize a new `Browser` with the given `html`, `server`
 * or `port` and `host`.
 *
 * Options:
 *
 *    - `external`   enable fetching and evaluation of external resources [false]
 *
 * @param {String|http.Server|Number} html
 * @param {Object|String} options
 * @param {Object} c
 * @api public
 */

var Browser = module.exports = exports = function Browser(html, options, c) {
  var host, port;
  // Host as second arg
  if ('string' == typeof options) host = options, options = null;
  // Options as third arg
  if (c) options = c;

  // Initialize
  options = options || {};
  this.external = options.external;
  this.history = [];
  this.cookieJar = new CookieJar;

  // Client types
  if ('number' == typeof html) {
    port = html;
    this.port = html;
    this.host = host;
  } else if ('string' == typeof html) {
    this.parse(html);
  } else {
    this.server = html;
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
  var options = {};
  if (!this.external) {
    options.features = {
        FetchExternalResources: false
      , ProcessExternalResources: false
    };
  }
  this.source = html;
  this.window = jsdom.jsdom(wrap(html), null, options).createWindow();
  this.jQuery = jQuery.create(this.window);
  this.jQuery.browser = this.jQuery.fn.browser = this;
  require('./jquery')(this, this.jQuery);
  this.context = this.jQuery('*');
};

/**
 * Set the jQuery context for the duration of `fn()` to `selector`.
 *
 * @param {String} selector
 * @param {Function} fn
 * @return {Browser} for chaining
 * @api public
 */

Browser.prototype.within =
Browser.prototype.context = function(selector, fn){
  var prev = this.context;
  this.context = this.context.find(selector);
  fn();
  this.context = prev;
  return this;
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
    , host = this.host || '127.0.0.1'
    , headers = options.headers || {};

  // Ensure that server is ready to take connections
  if (server && !server.fd){
    (server.__deferred = server.__deferred || [])
      .push(arguments);
    if (!server.__started) {
      server.listen(server.__port = ++startingPort, host, function(){
        process.nextTick(function(){
          server.__deferred.forEach(function(args){
            self.request.apply(self, args);
          });
        });
      });
      server.__started = true;
    }
    return;
  }

  // Save history
  if (false !== saveHistory) this.history.push(path);

  // Cookies
  var cookies = this.cookieJar.cookieString({ url: path });
  if (cookies) headers.Cookie = cookies;

  // Request body
  if (options.body) {
    headers['Content-Length'] = options.body.length;
  }

  // Request
  headers.Host = host;

  // HTTP client
  if (!this.client) {
    // portno & host supplied
    if (this.port && this.host) {
      this.client = http.createClient(this.port, this.host);
    } else {
      this.client = http.createClient(server.__port);
    }
  }

  var req = this.client.request(method, path, headers);
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
            fn(res, res.body);
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
        fn(res, function(selector){
          return self.context.find(selector);
        });
      });

    // Redirect
    } else if (status >= 300 && status < 400) {
      var location = res.headers.location;
      self.emit('redirect', location);
      self.request('GET', location, options, fn);

    // Error
    } else {
      fn(res);
    }
  });

  req.end(options.body);

  return this;
};

/**
 * GET `path` and callback `fn(res, jQuery)`.
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
 * HEAD `path` and callback `fn(res)`.
 *
 * @param {String} path
 * @param {Object|Function} options or fn
 * @param {Function} fn
 * @return {Browser} for chaining
 * @api public
 */

Browser.prototype.head = function(path, options, fn, saveHistory){
  if ('function' == typeof options) {
    saveHistory = fn;
    fn = options;
    options = {};
  }
  return this.request('HEAD', path, options, fn, saveHistory);
};

/**
 * POST `path` and callback `fn(res, jQuery)`.
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
 * @api private
 */

Browser.prototype.locate = function(selector, locator){
  var self = this
    , $ = this.jQuery;
  var elems = this.context.find(selector).filter(function(){
    var elem = $(this);
    return locator == elem.text()
      || locator == elem.attr('id')
      || locator == elem.attr('value')
      || locator == elem.attr('name')
      || elem.is(locator);
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
 * Uncheck the checkbox with the given `locator`.
 *
 * @param {String} locator
 * @return {Assertion} for chaining
 * @api public
 */

Browser.prototype.uncheck = function(locator){
  this.locate(':checkbox', locator)[0].removeAttribute('checked');
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
 * Submit form at the optional `locator` and callback `fn(res)`.
 *
 * @param {String|Function} locator
 * @param {Function} fn
 * @return {Browser} for chaining
 * @api public
 */

Browser.prototype.submit = function(locator, fn){
  if ('function' == typeof locator) {
    fn = locator;
    locator = '*';
  }
  return this.jQuery(this.locate('form', locator)).submit(fn, locator);
};

/**
 * Fill the given form `fields` and optional `locator`.
 *
 * @param {String} locator
 * @param {Object} fields
 * @return {Assertion} for chaining
 * @api public
 */

Browser.prototype.fill = function(locator, fields){
  if ('object' == typeof locator) {
    fields = locator;
    locator = '*';
  }
  this.jQuery(this.locate('form', locator)).fill(fields);
  return this;
};

/**
 * Return text at the given `locator`.
 *
 * @param {String} locator
 * @return {String}
 * @api public
 */

Browser.prototype.text = function(locator){
  return this.jQuery(this.locate('*', locator)).text();
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
