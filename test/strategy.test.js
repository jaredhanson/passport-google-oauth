/* global describe, it, expect */
/* jshint expr: true */

var GoogleStrategy = require('../lib/oauth2')
  , chai = require('chai');


describe('Strategy', function() {
  
  describe('constructed', function() {
    var strategy = new GoogleStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    }, function() {});
    
    it('should be named google', function() {
      expect(strategy.name).to.equal('google');
    });
  })
  
});