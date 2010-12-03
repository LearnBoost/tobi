
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
  , jQuery = require('jQuery')
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
  var self = this;
  this.source = html;
  this.window = jsdom.jsdom(html).createWindow();
  this.jQuery = jQuery.create(this.window);
  this.jQuery.browser = this;

  // TODO: move out
  this.jQuery.fn.click = function(fn, locator){
    var prop, url
      , method = 'get'
      , elem = this.get(0)
      , locator = locator || this.selector
      , options = {};

    switch (elem.nodeName) {
      case 'A':
        prop = 'href';
        url = elem.getAttribute('href');
        break;
      case 'INPUT':
        if ('submit' == elem.getAttribute('type')) {
          // TODO: default action to same url
          var form = this.parent('form');
          url = form.get(0).getAttribute('action');
          method = 'post';
          prop = 'form action';
          options.body = form.serialize();
          options.headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
          };
        }
        break;
    }

    // Ensure url present
    if (!url) throw new Error('failed to click ' + locator + ', ' + prop + ' not present');

    // Perform request
    self[method](url, options, fn);
  };

  // TODO: move out
  this.jQuery.fn.submit = function(fn, locator){
    this.find(':submit').click(fn, locator);
  };

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

  // Request
  headers.Host = host;
  var req = server.client.request(method, path, headers);
  req.on('response', function(res){
    --server.pending || server.close();
    var status = res.statusCode
      , buf = '';

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
        fn(self.jQuery);
      });

    // Redirect
    } else if (status >= 300 && status < 400) {
      var location = res.headers.location;
      self.emit('redirect', location);
      self.request(method, location, options, fn);

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
  var $ = this.jQuery;
  var elems = this.context.find(selector).filter(function(elem){
    return locator == $(elem).text()
      || locator == elem.getAttribute('id')
      || locator == elem.getAttribute('value')
      || locator == elem.getAttribute('name')
      || $(elem.parentNode).find(locator).length;
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
  return this.jQuery(this.locate('*', locator)).click(fn, locator);
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
  this.jQuery(this.locate('*', locator)).val(val);
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
 * Fill the given form `fields`.
 *
 * @param {Object} fields
 * @return {Assertion} for chaining
 * @api public
 */

Browser.prototype.fill = function(fields){
  var $ = this.jQuery;
  for (var locator in fields) {
    var val = fields[locator]
      , elem = this.locate('*', locator)[0];
    switch (elem.nodeName) {
      case 'INPUT':
        switch (elem.getAttribute('type')) {
          case 'checkbox':
            val && elem.setAttribute('checked', 'checked');
            break;
          default:
            $(elem).val(val);
        }
        break;
      case 'TEXTAREA':
        $(elem).val(val);
    }
  }
  return this;
};
