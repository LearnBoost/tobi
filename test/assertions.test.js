
/**
 * Module dependencies.
 */

var tobi = require('tobi')
  , express = require('express')
  , should = require('should');

// Assert error

function err(fn, msg){
  var err;
  try {
    fn();
  } catch (e) {
    should.equal(e.message, msg);
    return;
  }
  throw new Error('no exception thrown, expected "' + msg + '"');
}

// Test app

var app = express.createServer()
  , browser = tobi.createBrowser(app);

app.get('/user/:id', function(req, res){
  res.send('<h1 id="title">Tobi</h1><p>the ferret</p>');
});

app.get('/list', function(req, res){
  res.send('<ul><li>one</li><li>two</li><li><em>three<em></li></ul>');
});

app.get('/attrs', function(req, res){
  res.send('<a href="http://learnboost.com" title="LearnBoost">LearnBoost</a>');
});

app.get('/classes', function(req, res){
  res.send('<div class="foo bar baz"></div>');
});

app.get('/form', function(req, res){
  res.send('<form id="user">'
    + '<input type="text" name="user[name]" />'
    + '<input type="text" name="user[email]" disabled="disabled" />'
    + '<input type="submit" value="Update" />'
    + '</form>');
});

// Tests

exports['test .text()'] = function(done){
  browser.get('/user/1', function($){
    $('p').prev().should.have.text('Tobi');
    $('p').prev().should.have.text(/^To/);
    
    err(function(){
      $('h1').should.not.have.text('Tobi');
    }, "expected [jQuery 'h1'] to not have text 'Tobi'");

    err(function(){
      $('h1').should.have.text('Raul');
    }, "expected [jQuery 'h1'] to have text 'Raul'");
    
    err(function(){
      $('h1').should.have.text(/^Raul/);
    }, "expected [jQuery 'h1'] to have text matching /^Raul/");
    
    err(function(){
      $('h1').should.not.have.text(/^To/);
    }, "expected [jQuery 'h1'] text 'Tobi' to not match /^To/");

    done();
  });
};

exports['test .many()'] = function(done){
  browser.get('/list', function($){
    $('ul').should.have.many('li');
    $('ul').should.not.have.many('rawr');
    //$('ul').should.not.have.many('em');
    
    // err(function(){
    //   $('ul').should.have.many('p');
    // }, "expected [jQuery 'ul'] to have many 'p' tags, but has none");
    // 
    // err(function(){
    //   $('ul').should.have.many('em');
    // }, "expected [jQuery 'ul'] to have many 'em' tags, but has one");
    // 
    // err(function(){
    //   $('ul').should.not.have.many('li');
    // }, "expected [jQuery 'ul'] to not have many 'li' tags, but has 3");
    
    done();
  });
};

exports['test .one()'] = function(done){
  browser.get('/list', function($){
    $('ul').should.not.have.one('li');
    //$('ul > li:last-child').should.have.one('em');
    
    err(function(){
      $('ul').should.have.one('p');
    }, "expected [jQuery 'ul'] to have one 'p' tag, but has none");

    err(function(){
      $('ul').should.have.one('li');
    }, "expected [jQuery 'ul'] to have one 'li' tag, but has three");
    
    done();
  });
};

exports['test .attr()'] = function(done){
  browser.get('/attrs', function($){
    $('a').should.have.attr('href');
    $('a').should.have.attr('href', 'http://learnboost.com');
    $('a').should.not.have.attr('href', 'invalid');
    $('a').should.not.have.attr('rawr');

    err(function(){
      $('a').should.not.have.attr('href');
    }, "expected [jQuery 'a'] to not have attribute 'href', but has 'http://learnboost.com'");
    
    err(function(){
      $('a').should.not.have.attr('href', 'http://learnboost.com');
    }, "expected [jQuery 'a'] to not have attribute 'href' with 'http://learnboost.com'");
    
    err(function(){
      $('a').should.have.attr('foo');
    }, "expected [jQuery 'a'] to have attribute 'foo'");

    err(function(){
      $('a').should.have.attr('foo', 'bar');
    }, "expected [jQuery 'a'] to have attribute 'foo'");
    
    err(function(){
      $('a').should.have.attr('href', 'http://tobi.com');
    }, "expected [jQuery 'a'] to have attribute 'href' with 'http://tobi.com', but has 'http://learnboost.com'");
    
    done();
  });
};

// exports['test .class()'] = function(done){
//   browser.get('/classes', function($){
//     $('div').should.have.class('foo');
//     $('div').should.have.class('bar');
//     $('div').should.have.class('baz');
//     $('div').should.not.have.class('rawr');
// 
//     err(function(){
//       $('div').should.not.have.class('foo');
//     }, "expected [jQuery 'a'] to not have class 'foo'");
// 
//     err(function(){
//       $('a').should.have.class('rawr');
//     }, "expected [jQuery 'a'] to have class 'rawr', but has 'foo bar baz'");
//   });
// };

exports['test .enabled / .disabled'] = function(done){
  browser.get('/form', function($){
    $('input[name="user[name]"]').should.be.enabled;
    $('input[name="user[email]"]').should.be.disabled;

    err(function(){
      $('input[name="user[email]"]').should.be.enabled;
    }, "expected [jQuery 'input[name=\"user[email]\"]'] to be enabled");

    err(function(){
      $('input[name="user[name]"]').should.be.disabled;
    }, "expected [jQuery 'input[name=\"user[name]\"]'] to be disabled");
  
    done();
  });
};
