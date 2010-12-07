
/*!
 * Tobi - jQuery - fill
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Select options.
 */

exports.select = function($, elems, val){
  $(elems).select(val);
};

/**
 * Fill inputs:
 *
 *   - toggle radio buttons
 *   - check checkboxes
 *   - default to .val(val)
 *
 */

exports.input = function($, elems, val){
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
};

/**
 * Fill textarea.
 */

exports.textarea = function($, elems, val){
  $(elems).val(val);
}