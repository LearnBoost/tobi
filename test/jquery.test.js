
/**
 * Module dependencies.
 */

var tobi = require('tobi')
  , should = require('should');

function jquery(html) {
  return tobi.createBrowser(html).jQuery;
}

module.exports = {
  'test .fill()': function(){
    var $ = jquery('<form>'
      + '<input type="text" name="username" />'
      + '</form>');

    $('form').fill({ username: 'tjholowaychuk' });
    $('form > input[name=username]').should.have.attr('value', 'tjholowaychuk');
  }
};