
/**
 * Module dependencies.
 */

var tobi = require('tobi')
  , Cookie = tobi.Cookie
  , Jar = tobi.CookieJar
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
  
  'test .httpOnly': function(){
    cookie.should.have.property('httpOnly', true);
  },
  
  'test .name': function(){
    cookie.should.have.property('name', 'connect.sid');
  },
  
  'test .value': function(){
    cookie.should.have.property('value', 's543qactge.wKE61E01Bs%2BKhzmxrwrnug');
  }
};