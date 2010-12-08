
/*!
 * Tobi - jQuery - fill
 * Copyright(c) 2010 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Select options.
 */

exports.select = function($, elems, val){
  elems.select(val);
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
  switch (elems.attr('type')) {
    case 'radio':
      elems.each(function(){
        var elem = $(this);
        val == elem.attr('value')
          ? elem.attr('checked', true)
          : elem.removeAttr('checked');
      });
      break;
    case 'checkbox':
      val
        ? elems.attr('checked', true)
        : elems.removeAttr('checked');
      break;
    default:
      elems.val(val);
  }
};

/**
 * Fill textarea.
 */

exports.textarea = function($, elems, val){
  elems.val(val);
}