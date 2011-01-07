
# Tobi

  Expressive server-side functional testing with jQuery and [jsdom](https://github.com/tmpvar/jsdom).

  Tobi allows you to test your web application as if it were a browser. Interactions with your app are performed via jsdom, htmlparser, and jQuery, in combination with Tobi's Cookie Jar, provides a natural JavaScript API for traversing, manipulating and asserting the DOM, and session based browsing.

## Example

In the example below, we have an http server or express app `require()`ed, and we simply create new tobi `Browser` for that app to test against. Then we `GET /login`, receiving a response to assert headers, status codes etc, and the `$` jQuery context.

We can then use regular css selectors to grab the form, we use tobi's `.fill()` method to fill some inputs (supports textareas, checkboxes, radios, etc), then we proceed to submitting the form, again receiving a response and the jQuery context.

    var tobi = require('tobi')
      , app = require('./my/app)
      , browser = tobi.createBrowser(app);

    browser.get('/login', function(res, $){
      $('form')
        .fill({ username: 'tj', password: 'tobi' })
        .submit(function(res, $){
          res.should.have.status(200);
          res.should.have.header('Content-Length');
          res.should.have.header('Content-Type', 'text/html; charset=utf-8');
          $('ul.messages').should.have.one('li', 'Successfully authenticated');
          browser.get('/login', function(res, $){
            res.should.have.status(200);
            $('ul.messages').should.have.one('li', 'Already authenticated');
            // We are finished testing, close the server
            app.close();
          });
        });
    });

## Browser

Tobi provides the `Browser` object, created via `tobi.createBrowser(app)`, where `app` is a node `http.Server`, so for example Connect or Express apps will work just fine. There is no need to invoke `listen()` as this is handled by Tobi, and requests will be deferred until the server is listening.

Alternatively you may pass a `port` and `host` to `createBrowser()`, for example:

    var browser = tobi.createBrowser(80, 'lb.dev'); 

### Evaluate External Resources

To evaluate script tags simply pass the `{ external: true }` option:

    var browser = tobi.createBrowser(app, { external: true });

### Browser#get()

Perform a `GET` request with optional `options` containing headers, etc:

    browser.get('/login', function(res, $){
      
    });

With options:

    browser.get('/login', { headers: { ... }}, function(res, $){
      
    });

Aliased as `visit`, and `open`.

### Browser#post()

Perform a `POST` request with optional `options` containing headers, body etc:

    browser.post('/login', function(res, $){
      
    });

With options:

    browser.post('/login', { body: 'foo=bar' }, function(res, $){
      
    });

### Browser#back()

`GET` the previous page:

    browser.get('/', function(){
      // on /
      browser.get('/foo', function(){
        // on /foo
        browser.back(function(){
          // on /
        });
      });
    });

## Browser locators

Locators are extended extend selectors, the rules are as following:

  - element text
  - element id
  - element value
  - css selector

These rules apply to all `Browser` related methods such as `click()`, `fill()`, `type()` etc. Provided the following markup:

    <form>
      <input id="form-login" type="submit" value="Login" />
    </form>

The following locators will match the input:

    .click('Login');
    .click('form-login');
    .click('input[type=submit]');
    .click(':submit');

### Browser#click(locator[, fn])

Tobi allows you to `click()` `a` elements, and `input[type=submit]` elements in order to submit a form, or request a url.

Submitting a form:

    browser.click('Login', function(res, $){
      
    });

Submitting with jQuery (no locators):

    $('form :submit').click(function(res, $){
      
    });

Clicking a link:

    browser.click('Register Account', function(res, $){
      
    });

Clicking with jQuery (no locators):

    $('a.register', function(res, $){
      
    });

### Browser#submit(locator|fn, fn)

Submit the first form in context:

    browser.submit(function(res, $){
      
    });

    browser.submit(function(){
      
    });

### Browser#type(locator, str)

"Type" the given _str_:

    browser
      .type('username', 'tj') 
      .type('password', 'foobar');


### Browser#{check,uncheck}(locator)

Check or uncheck the given _locator_:

    browser
      .check('agreement')
      .uncheck('agreement');

### Browser#select(locator, options)

Select the given option or options:

    browser
      .select('colors', 'Red')
      .select('colors', ['Red', 'Green']);

### Browser#fill(locator, fields)

Fill the given _fields_, supporting all types of inputs. For example we might have the following form:

    <form>
      <input type="text" name="user[name]" />
      <input type="text" name="user[email]" />
      <input type="checkbox" name="user[agreement]" />
      
      <select name="digest">
        <option value="none">Never</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>
      
      <select name="favorite-colors" multiple>
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
      </select>
    </form> 

Which can be filled using locators:

    browser
      .fill({
          'user[name]': 'tj'
        , 'user[email]': 'tj@learnboost.com'
        , 'user[agreement]': true
        , 'user[digest]': 'Daily'
        , 'user[favorite-colors]': ['red', 'Green']
      }).submit(function(){
        
      });

With jQuery:

    $('form')
      .fill({
          'user[name]': 'tj'
        , 'user[favorite-colors]': 'red'
      }).submit(function(){
        
      });

### Browser#text(locator)

Return text at the given locator. For example if we have the form option somewhere in our markup:

    <option value="once">Once per day</option>

We can invoke `browser.text('once')` returning "Once per day".

### Browser#{context,within}(selector, fn)

Alter the browser context for the duration of the given callback `fn`. For example if you have several forms on a page, an wish to focus on one:

    <div><form id="user-search" method="post" action="/search/users">
      <input type="text" name="query" />
    </form></div>

    <div><form id="post-search" method="post" action="/search/posts">
      <input type="text" name="query" />
    </form></div>

Example test using contexts:

    browser.get('/search', function(res, $){

      // Global context has 2 forms
      $('form').should.have.length(2);

      // Focus on the second div
      browser.within('div:nth-child(2)', function(){

        // We now have one form, and no direct input children
        $('> form').should.have.length(1);
        $('> input').should.have.length(0);

        // Focus on the form, we now have a single direct input child
        browser.within('form', function(){
          $('> form').should.have.length(0);
          $('> input').should.have.length(1);
        });

        // Back to our div focus, we have one form again
        $('> form').should.have.length(1);
        $('> input').should.have.length(0);

        // Methods such as .type() etc work with contexts
        browser
        .type('query', 'foo bar')
        .submit(function(res){

        });
      });

      // Back to global context
      $('form').should.have.length(2);
    });

## Assertions

Tobi extends the [should.js](http://github.com/visionmedia/should.js) assertion library to provide you with DOM and response related assertion methods.

### Assertion#text(str|regexp)

  Assert element text via regexp or string:
  
      elem.should.have.text('foo bar');
      elem.should.have.text(/^foo/);
      elem.should.not.have.text('rawr');

  When asserting a descendant's text amongst a heap of elements, we can utilize the `.include` modifier:

      $('*').should.include.text('My Site');

### Assertion#many(selector)

  Assert that one or more of the given selector is present:
  
      ul.should.have.many('li');

### Assertion#one(selector)

  Assert that one of the given selector is present:
  
      p.should.have.one('input');

### Assertion#attr(key[, val])

  Assert that the given _key_ exists, with optional _val_:
  
      p.should.not.have.attr('href');
      a.should.have.attr('href');
      a.should.have.attr('href', 'http://learnboost.com');

  Shortcuts are also provided:
  
    - id()
    - title()
    - href()
    - alt()
    - src()
    - rel()
    - media()
    - name()
    - action()
    - method()
    - value()
    - enabled
    - disabled
    - checked
    - selected

For example:

      form.should.have.id('user-edit');
      form.should.have.action('/login');
      form.should.have.method('post');
      checkbox.should.be.enabled;
      checkbox.should.be.disabled;
      option.should.be.selected;
      option.should.not.be.selected;

### Assertion#class(name)

  Assert that the element has the given class _name_.

      form.should.have.class('user-edit');

### Assertion#status(code)

  Assert response status code:
  
      res.should.have.status(200);
      res.should.not.have.status(500);

### Assertion#header(field[, val])

  Assert presence of response header _field_ and optional _val_:
  
      res.should.have.header('Content-Length');
      res.should.have.header('Content-Type', 'text/html');

## Testing

Update submodules:

    $ git submodule update --init

and execute:

    $ make test

## WWTD

What Would Tobi Do:

![Tobi](http://sphotos.ak.fbcdn.net/hphotos-ak-snc3/hs234.snc3/22173_446973930292_559060292_10921426_7238463_n.jpg)

## License 

(The MIT License)

Copyright (c) 2010 LearnBoost &lt;dev@learnboost.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation te rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.