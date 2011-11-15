
/**
 * Module dependencies.
 */

var tobi = require('../')
  , Cookie = tobi.Cookie
  , should = require('should');

var str = 'connect.sid=s543qactge.wKE61E01Bs%2BKhzmxrwrnug; path=/; httpOnly; expires=Sat, 04 Dec 2010 23:27:28 GMT';
var cookie = new Cookie(str);

module.exports = {
  'test .toString()': function(){
    cookie.toString().should.equal(str);
  },
  
  'test .path': function(){
    cookie.should.have.property('path', '/');
  },
  
  'test .path default': function(){
    var cookie = new Cookie('foo=bar', { url: 'http://foo.com/bar' });
    cookie.should.have.property('path', '/bar');
  },
  
  'test .httpOnly': function(){
    cookie.should.have.property('httpOnly', true);
  },
  
  'test .name': function(){
    cookie.should.have.property('name', 'connect.sid');
  },
  
  'test .value': function(){
    cookie.should.have.property('value', 's543qactge.wKE61E01Bs%2BKhzmxrwrnug');
  },
  
  'test .expires': function(){
    cookie.should.have.property('expires');
    cookie.expires.should.be.an.instanceof(Date);
    cookie.expires.getDay().should.equal(6);
  }
};