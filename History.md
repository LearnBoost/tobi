
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
