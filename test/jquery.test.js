
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
      + '<input type="password" name="password" />'
      + '<input type="radio" name="signature" value="display" />'
      + '<input type="radio" name="signature" value="hide" />'
      + '<input type="checkbox" name="agreement" value="ageed" />'
      + '<input type="checkbox" name="email" value="yes" checked="checked" />'
      + '</form>');

    $('form').fill({
        username: 'tjholowaychuk'
      , signature: 'display'
      , agreement: true
      , email: false
    });

    $('form > input[name=username]').should.have.attr('value', 'tjholowaychuk');
    $('form > input[value=display]').should.be.checked;
    $('form > input[name=agreement]').should.be.checked;
    $('form > input[name=email]').should.not.be.checked;
  }
};