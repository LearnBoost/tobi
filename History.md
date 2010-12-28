
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
