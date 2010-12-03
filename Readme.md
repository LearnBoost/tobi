
# Tobi

  "Testing of browser integration" ? haha

## Todo

starting with the lower level api:

    browser.get('/', function($){
      $('h1.title').should.have.text('Tobi is awesome');
      $('p:first-child ~ h1').should.have.text('but so is raul');
      $('a').click(function(){
        $('h1.title').should.have.text('A new page!');
        browser.back(function(){
          $('h1.title').should.have.text('Tobi is awesome');
        });
      });
    });

building up to a jQuery/soda inspired api providing a more concise interface for simple cases, but still maintaining flexibility in the design. Maybe something like:

    browser
      .get('/')
      .find('h1.title').assertText('Tobi is awesome')
      .find('p:first-child ~ h1').assertText('but so is raul')
      .find('a')
      .click()
      .find('h1.title').assertText('A new page!')
      .back()
      .find('h1.title').assertText('Tobi is awesome');

## Testing

Update submodules:

    $ git submodule update --init

and execute:

    $ make test

## License 

(The MIT License)

Copyright (c) 2010 LearnBoost &lt;dev@learnboost.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
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