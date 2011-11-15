
/**
 * Module dependencies.
 */

var tobi = require('../')
  , Cookie = tobi.Cookie
  , Jar = tobi.CookieJar
  , should = require('should');

function expires(ms) {
  return new Date(Date.now() + ms).toUTCString();
}

module.exports = {
  'test .get() expiration': function(done){
    var jar = new Jar;
    var cookie = new Cookie('sid=1234; path=/; expires=' + expires(1000));
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
  },
  
  'test .get() path support': function(){
    var jar = new Jar;
    var a = new Cookie('sid=1234; path=/');
    var b = new Cookie('sid=1111; path=/foo/bar');
    var c = new Cookie('sid=2222; path=/');
    jar.add(a);
    jar.add(b);
    jar.add(c);

    // should remove the duplicates
    jar.cookies.should.have.length(2);

    // same name, same path, latter prevails
    var cookies = jar.get({ url: 'http://foo.com/' });
    cookies.should.have.length(1);
    cookies[0].should.equal(c);

    // same name, diff path, path specifity prevails, latter prevails
    var cookies = jar.get({ url: 'http://foo.com/foo/bar' });
    cookies.should.have.length(1);
    cookies[0].should.equal(b);

    var jar = new Jar;
    var a = new Cookie('sid=1111; path=/foo/bar');
    var b = new Cookie('sid=1234; path=/');
    jar.add(a);
    jar.add(b);

    var cookies = jar.get({ url: 'http://foo.com/foo/bar' });
    cookies.should.have.length(1);
    cookies[0].should.equal(a);

    var cookies = jar.get({ url: 'http://foo.com/' });
    cookies.should.have.length(1);
    cookies[0].should.equal(b);

    var jar = new Jar;
    var a = new Cookie('sid=1111; path=/foo/bar');
    var b = new Cookie('sid=3333; path=/foo/bar');
    var c = new Cookie('pid=3333; path=/foo/bar');
    var d = new Cookie('sid=2222; path=/foo/');
    var e = new Cookie('sid=1234; path=/');
    jar.add(a);
    jar.add(b);
    jar.add(c);
    jar.add(d);
    jar.add(e);

    var cookies = jar.get({ url: 'http://foo.com/foo/bar' });
    cookies.should.have.length(2);
    cookies[0].should.equal(b);
    cookies[1].should.equal(c);

    var cookies = jar.get({ url: 'http://foo.com/foo/' });
    cookies.should.have.length(1);
    cookies[0].should.equal(d);

    var cookies = jar.get({ url: 'http://foo.com/' });
    cookies.should.have.length(1);
    cookies[0].should.equal(e);
  }
};
