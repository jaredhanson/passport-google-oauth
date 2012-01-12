var vows = require('vows');
var assert = require('assert');
var util = require('util');
var google = require('passport-google-oauth');


vows.describe('passport-google-oauth').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(google.version);
    },
    'should export OAuth strategy': function (x) {
      assert.isFunction(google.Strategy);
      assert.isFunction(google.OAuthStrategy);
      assert.equal(google.Strategy, google.OAuthStrategy);
    },
    'should export OAuth 2.0 strategy': function (x) {
      assert.isFunction(google.OAuth2Strategy);
    },
  },
  
}).export(module);
