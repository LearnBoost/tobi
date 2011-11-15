
/**
 * Module dependencies.
 */

var tobi = require('../')
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
  res.send('<p>Wahoo</p><ul><li>one</li><li>two</li><li><em>three<em></li></ul>');
});

app.get('/attrs', function(req, res){
  res.send('<a id="lb" href="http://learnboost.com" title="LearnBoost">LearnBoost</a>');
});

app.get('/classes', function(req, res){
  res.send('<div class="foo bar baz"></div>');
});

app.get('/form', function(req, res){
  res.send('<form id="user">'
    + '<input type="checkbox" name="user[agreement]" checked="checked" />'
    + '<input type="checkbox" name="user[agreement2]" />'
    + '<input type="text" name="user[name]" />'
    + '<input type="text" name="user[email]" disabled="disabled" />'
    + '<input type="submit" value="Update" />'
    + '<select>'
    + '  <option value="one">One</option>'
    + '  <option value="two">Two</option>'
    + '  <option value="three" selected="selected">Two</option>'
    + '</select>'
    + '</form>');
});

// Tests

exports['test .text()'] = function(done){
  browser.get('/user/1', function(res, $){
    $('p').prev().should.have.text('Tobi');
    $('p').prev().should.have.text(/^To/);
    
    $('*').should.not.have.text('Tobi');
    $('*').should.include.text('Tobi');
    
    err(function(){
      $('*').should.not.include.text('Tobi');
    }, "expected [jQuery '*'] to not include text 'Tobi' within 'Tobithe ferretTobithe ferret'");

    err(function(){
      $('*').should.include.text('Shuppa');
    }, "expected [jQuery '*'] to include text 'Shuppa' within 'Tobithe ferretTobithe ferret'");
    
    err(function(){
      $('h1').should.not.have.text('Tobi');
    }, "expected [jQuery 'h1'] to not have text 'Tobi'");

    err(function(){
      $('h1').should.have.text('Raul');
    }, "expected [jQuery 'h1'] to have text 'Raul', but has 'Tobi'");
    
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
  browser.get('/list', function(res, $){
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
  browser.get('/list', function(res, $){
    $('ul').should.not.have.one('li');
    //$('ul > li:last-child').should.have.one('em');
    
    err(function(){
      $('ul').should.have.one('p');
    }, "expected [jQuery 'ul'] to have one 'p' tag, but has none");

    err(function(){
      $('ul').should.have.one('li');
    }, "expected [jQuery 'ul'] to have one 'li' tag, but has three");

    err(function(){
      $('*').should.have.one('p', 'Wahoos');
    }, "expected [jQuery '* p'] to have text 'Wahoos', but has 'Wahoo'");

    done();
  });
};

exports['test .attr()'] = function(done){
  browser.get('/attrs', function(res, $){
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

exports['test .class()'] = function(done){
  browser.get('/classes', function(res, $){
    $('div').should.have.class('foo');
    $('div').should.have.class('bar');
    $('div').should.have.class('baz');
    $('div').should.not.have.class('rawr');

    err(function(){
      $('div').should.not.have.class('foo');
    }, "expected [jQuery 'div'] to not have class 'foo'");

    err(function(){
      $('div').should.have.class('rawr');
    }, "expected [jQuery 'div'] to have class 'rawr', but has 'foo bar baz'");

    done();
  });
};

exports['test .enabled / .disabled'] = function(done){
  browser.get('/form', function(res, $){
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

exports['test .checked'] = function(done){
  browser.get('/form', function(res, $){
    $('input[name="user[agreement]"]').should.be.checked;
    $('input[name="user[agreement2]"]').should.not.be.checked;

    err(function(){
      $('input[name="user[agreement2]"]').should.be.checked;
    }, "expected [jQuery 'input[name=\"user[agreement2]\"]'] to be checked");

    err(function(){
      $('input[name="user[agreement]"]').should.not.be.checked;
    }, "expected [jQuery 'input[name=\"user[agreement]\"]'] to not be checked");
  
    done();
  });
};

exports['test .selected'] = function(done){
  browser.get('/form', function(res, $){
    $('select > option:nth-child(3)').should.be.selected;
    $('select > option:nth-child(2)').should.not.be.selected;

    err(function(){
      $('select > option:nth-child(2)').should.be.selected;
    }, "expected [jQuery 'select > option:nth-child(2)'] to be selected");

    err(function(){
      $('select > option:nth-child(3)').should.not.be.selected;
    }, "expected [jQuery 'select > option:nth-child(3)'] to not be selected");
  
    done();
  });
};

exports['test .id()'] = function(done){
  browser.get('/attrs', function(res, $){
    $('a').should.have.id('lb');
    $('a').should.not.have.id('foo');

    err(function(){
      $('a').should.have.id('rawr');
    }, "expected [jQuery 'a'] to have id 'rawr', but has 'lb'");

    err(function(){
      $('a').should.not.have.id('lb');
    }, "expected [jQuery 'a'] to not have id 'lb'");

    done();
  });
};

exports['test .status()'] = function(done){
  browser.get('/attrs', function(res, $){
    res.should.have.status(200);

    err(function(){
      res.should.have.status(404);
    }, "expected response code of 404 'Not Found', but got 200 'OK'");

    done();
  });
};

exports['test .header()'] = function(done){
  browser.get('/attrs', function(res, $){
    res.should.have.header('Content-Type', 'text/html; charset=utf-8');
    done();
  });
};

exports.after = function(){
  app.close();
};