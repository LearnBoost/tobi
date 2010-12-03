
/*!
 * Chrono - Browser
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
};

/**
 * Request `path` with `method` and callback `fn()`.
 *
 * @param {String} path
 * @param {String} method
 * @param {Function} fn
 * @return {Browser} for chaining
 * @api public
 */

Browser.prototype.request = function(method, path, fn){
  var server = this.server
    , host = '127.0.0.1';

  // Ensure server
  if (!server) throw new Error('no .server present');
  ++server.pending;

  // HTTP client
  // TODO: options for headers, request body etc
  if (!server.fd) {
    server.listen(++server.port, host);
    server.client = http.createClient(server.port);
  }

  // Save history
  this.history.push(path);

  // Request
  var req = server.client.request(method, path, { Host: host });
  req.on('response', function(res){
    --server.pending || server.close();

    var status = res.statusCode
      , buf = '';

    // Success
    if (status >= 200 && status < 300) {
      // TODO: options
      res.setEncoding('utf8');
      res.on('data', function(chunk){
        buf += chunk;
      });
      res.on('end', fn);
    }
  });
  req.end();
  return this;
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
