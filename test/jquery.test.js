
/**
 * Module dependencies.
 */

var tobi = require('../')
  , should = require('should');

function jquery(html) {
  return tobi.createBrowser(html).jQuery;
}

module.exports = {
  'test .fill()': function(){
    var $ = jquery('<form>'
      + '<input id="field-username" type="text" name="username" />'
      + '<input type="password" name="password" />'
      + '<input type="radio" name="signature" value="display" />'
      + '<input type="radio" name="signature" value="hide" />'
      + '<input type="checkbox" name="agreement" value="ageed" />'
      + '<input type="checkbox" name="email" value="yes" checked="checked" />'
      + '<select name="province">'
      + '  <option value="bc">British Columbia</option>'
      + '  <option value="ab">Alberta</option>'
      + '</select>'
      + '</form>');

    $('form').fill({
        'field-username': 'tjholowaychuk'
      , signature: 'display'
      , agreement: true
      , email: false
      , province: 'bc'
    });

    $('form > input[name=username]').should.have.attr('value', 'tjholowaychuk');
    $('form > input[value=display]').should.be.checked;
    $('form > input[name=agreement]').should.be.checked;
    $('form > input[name=email]').should.not.be.checked;
    $('select > option[value=bc]').should.be.selected;
    $('select > option[value=ab]').should.not.be.selected;
    
    $('form').fill({ province: ['ab', 'bc'] });
    
    $('select > option[value=bc]').should.be.selected;
    $('select > option[value=ab]').should.be.selected;
    
    $('form').fill({ province: 'ab' });
    
    $('select > option[value=bc]').should.not.be.selected;
    $('select > option[value=ab]').should.be.selected;
  }
};