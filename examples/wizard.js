
// Expose support modules

require.paths.unshift(__dirname + '/../support');

/**
 * Module dependencies.
 */

var app = require('./app')
  , tobi = require('../')
  , should = require('should')
  , browser = tobi.createBrowser(app);

browser.get('/wizard', function(res, $){
  res.should.have.status(200);
  $('h1').should.have.text('Account');
  $('form')
    .fill({
        name: 'tj'
      , email: 'tj@learnboost.com'
    }).submit(function(res, $){
      res.should.have.status(200);
      $('h1').should.have.text('Details');
      $('form')
        .fill({ city: 'Victoria' })
        .find('[value=Continue]')
        .click(function(res, $){
          res.should.have.status(200);
          $('h1').should.have.text('Review');
          $(':submit').should.have.value('Complete');
          $('ul li:nth-child(1)').should.have.text('Name: tj');
          $('ul li:nth-child(2)').should.have.text('Email: tj@learnboost.com');
          $('ul li:nth-child(3)').should.have.text('City: victoria');
          $('form').submit(function(res, $){
            res.should.have.status(200);
            $('h1').should.have.text('Registration Complete');
            $('ul li:nth-child(1)').should.have.text('Name: tj');
            $('ul li:nth-child(2)').should.have.text('Email: tj@learnboost.com');
            $('ul li:nth-child(3)').should.have.text('City: victoria');
            console.log('successful');
            app.close();
          });
        });
    });
});
