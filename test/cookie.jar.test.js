
/**
 * Module dependencies.
 */

var tobi = require('tobi')
  , Cookie = tobi.Cookie
  , Jar = tobi.CookieJar
  , should = require('should');

function expires(ms) {
  return new Date(Date.now() + ms).toUTCString();
}

module.exports = {
  'test .get() expiration': function(done){
    var str = 'sid=1234; path=/; expires=' + expires(1000);
    var cookie = new Cookie(str);
    var jar = new Jar;
    jar.add(cookie);
    setTimeout(function(){
      var cookies = jar.get({ url: 'http://foo.com/foo' });
      cookies.should.have.length(1);
      cookies[0].should.equal(cookie);
      setTimeout(function(){
        var cookies = jar.get({ url: 'http://foo.com/foo' });
        cookies.should.have.length(0);
        done();
      }, 1000);
    }, 5);
  }
};