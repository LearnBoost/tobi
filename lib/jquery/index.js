
/*!
 * Tobi - jQuery
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var parse = require('url').parse;

/**
 * Augment the given `jQuery` instance.
 *
 * @param {Browser} browser
 * @param {jQuery} $
 * @api private
 */

module.exports = function(browser, $){
  
  /**
   * Select the given `options` by text or value attr.
   *
   * @param {Array} options
   * @api public
   */

  $.fn.select = function(options){
    if ('string' == typeof options) options = [options];

    this.find('option').filter(function(i, option){
      return ~options.indexOf($(option).text())
        || ~options.indexOf(option.getAttribute('value'));
    }).each(function(i, option){
      option.setAttribute('selected', 'selected');
    });

    return this;
  };

  /**
   * Click the first element with callback `fn(jQuery, res)`
   * when text/html or `fn(res)` otherwise.
   *
   *   - requests a tag href
   *   - requests form submit's parent form action
   *
   * @param {Function} fn
   * @api public
   */

  $.fn.click = function(fn, locator){
    var url
      , prop = 'element'
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
          var form = this.parent('form');
          method = form.get(0).getAttribute('method') || 'get';
          url = form.get(0).getAttribute('action') || parse($.browser.path).pathname;
          if ('get' == method) {
            url += '?' + form.serialize();
          } else  {
            options.body = form.serialize();
            options.headers = {
              'Content-Type': 'application/x-www-form-urlencoded'
            };
          }
        }
        break;
    }

    // Ensure url present
    if (!url) throw new Error('failed to click ' + locator + ', ' + prop + ' not present');

    // Perform request
    browser[method](url, options, fn);
  };

  $.fn.fill = function(fields){
    for (var locator in fields) {
      var val = fields[locator]
        , elems = browser.locate('select, input, textarea', locator);
      switch (elems[0].nodeName) {
        case 'SELECT':
          $(elems).select(val);
          break;
        case 'INPUT':
          switch (elems[0].getAttribute('type')) {
            case 'radio':
              elems.forEach(function(elem){
                if (val == elem.getAttribute('value')) {
                  elem.setAttribute('checked', 'checked');
                } else {
                  elem.removeAttribute('checked');
                }
              });
              break;
            case 'checkbox':
              val && elems[0].setAttribute('checked', 'checked');
              break;
            default:
              $(elems).val(val);
          }
          break;
        case 'TEXTAREA':
          $(elems).val(val);
      }
    }
    return this;
  };

  /**
   * Submit this form with the given callback fn.
   *
   * @param {Function} fn
   * @api public
   */

  $.fn.submit = function(fn, locator){
    this.find(':submit').click(fn, locator);
  };
};