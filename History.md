
0.3.2 / 2011-11-15 
==================

  * Added: allow for `button[type=submit]` elements to be clicked
  * node >= 0.4.x < 0.7.0. Closes #70
  * Fixed tests for 0.6.x

0.3.1 / 2011-07-19 
==================

  * Fixed body on non-2xx response. Closes #56
  * Update jQuery to 1.6.2. Closes #43

0.3.0 / 2011-07-01 
==================

  * Added ability to set User-Agent on the browser via `Browser#userAgent` [bnoguchi]
  * Fixed redirection from one host to another [bnoguchi]
  * Fixed http -> https redirects [bnoguchi]
  * Fixed support for uppercased form methods [bnoguchi]
  * Updated internals to use new node http agent [bnoguchi]

0.2.2 / 2011-06-28 
==================

  * Added submit input values on submission [mhemesath]
  * Added default content-type for POST [bantic]
  * Added dev dependency for connect [bantic]
  * Added an option followRedirects to Browser [bantic]
  * Added HTTP 204 support. [bantic]

0.2.1 / 2011-05-16 
==================

  * Added `Browser#delete()`. Closes #31
  * Added `Browser#put()`
  * Added devDependencies to package.json
  * Fixed `make test`

0.2.0 / 2011-04-13 
==================

  * node 0.4.x
  * Fixed cookie support due to array
  * Fixed `session()` usage in tests
  * Fixed querystring related issues for 0.4.x
  * Fixed redirect `Location` support

0.1.1 / 2011-01-13 
==================

  * Fixed jquery npm issue. Closes #20

0.1.0 / 2011-01-07 
==================

  * Added `createBrowser(port, host)` support
  * Added `.include` modifier support to the `.text()` assertion method

0.0.8 / 2010-12-29 
==================

  * Fixed potential portno issue

0.0.7 / 2010-12-29 
==================

  * Added specificity prevalance when getting and filtered duplication when adding (cookie jar)
  * Added failing test of a cookie jar behavior that better resembles browers'.

0.0.6 / 2010-12-28 
==================

  * Fixed problem with listen() firing on the same tick

0.0.5 / 2010-12-28 
==================

  * Fixed; deferring all requests until the server listens
  * Added failing test

0.0.4 / 2010-12-28 
==================

  * Fixed; defer the request until the server listen callback fires
  * Added failing test for deferred listen
  * Changed; removed useless port++

0.0.3 / 2010-12-28 
==================

  * Added; passing JSON obj as 2nd argument [guillermo]
  * Fixed; increment portno per Browser

0.0.2 / 2010-12-27 
==================

  * Added Browser#text(locator) [guillermo]
  * Added failing test, which consists of the same form only with the input type="submit" being nested and not a direct descendent of the form.
  * Fixed; using `.parents()` instead of `parent()` to access a form that could be more than one level above. [guillermo]

0.0.1 / 2010-12-27 
==================

  * Initial release
