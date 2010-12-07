
/*!
 * Tobi - jQuery
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var jQuery = require('../support/jquery');

// TODO: move out
jQuery.fn.select = function(options){
  if ('string' == typeof options) options = [options];

  this.find('option').filter(function(i, option){
    return ~options.indexOf(self.jQuery(option).text())
      || ~options.indexOf(option.getAttribute('value'));
  }).each(function(i, option){
    option.setAttribute('selected', 'selected');
  });
  
  return this;
};

// TODO: move out
jQuery.fn.click = function(fn, locator){
  console.log(locator);
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
        // TODO: default action to same url
        // TODO: method support
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
jQuery.fn.submit = function(fn, locator){
  this.find(':submit').click(fn, locator);
};