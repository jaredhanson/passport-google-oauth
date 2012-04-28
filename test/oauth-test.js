var vows = require('vows');
var assert = require('assert');
var util = require('util');
var GoogleStrategy = require('passport-google-oauth/oauth');


vows.describe('GoogleStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new GoogleStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
    },
    
    'should be named google': function (strategy) {
      assert.equal(strategy.name, 'google');
    },
  },
  
  'strategy request token params': {
    topic: function() {
      return new GoogleStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
    },
    
    'should return scope': function (strategy) {
      var params = strategy.requestTokenParams({ scope: 'x' });
      assert.equal(params.scope, 'x');
    },
    'should return concatenated scope from array': function (strategy) {
      var params = strategy.requestTokenParams({ scope: ['x', 'y'] });
      assert.equal(params.scope, 'x y');
    },
  },
  
  'strategy when loading user profile': {
    topic: function() {
      var strategy = new GoogleStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth.get = function(url, token, tokenSecret, callback) {
        var body = '{"version":"1.0","encoding":"UTF-8","feed":{"xmlns":"http://www.w3.org/2005/Atom","xmlns$openSearch":"http://a9.com/-/spec/opensearchrss/1.0/","xmlns$gContact":"http://schemas.google.com/contact/2008","xmlns$batch":"http://schemas.google.com/gdata/batch","xmlns$gd":"http://schemas.google.com/g/2005","id":{"$t":"example@gmail.com"},"updated":{"$t":"2012-01-10T19:21:31.537Z"},"category":[{"scheme":"http://schemas.google.com/g/2005#kind","term":"http://schemas.google.com/contact/2008#contact"}],"title":{"type":"text","$t":"Jared Hanson\'s Contacts"},"link":[{"rel":"alternate","type":"text/html","href":"http://www.google.com/"},{"rel":"http://schemas.google.com/g/2005#feed","type":"application/atom+xml","href":"https://www.google.com/m8/feeds/contacts/example%40gmail.com/full"},{"rel":"http://schemas.google.com/g/2005#post","type":"application/atom+xml","href":"https://www.google.com/m8/feeds/contacts/example%40gmail.com/full"},{"rel":"http://schemas.google.com/g/2005#batch","type":"application/atom+xml","href":"https://www.google.com/m8/feeds/contacts/example%40gmail.com/full/batch"},{"rel":"self","type":"application/atom+xml","href":"https://www.google.com/m8/feeds/contacts/example%40gmail.com/full?alt\\u003djson\\u0026max-results\\u003d1"},{"rel":"next","type":"application/atom+xml","href":"https://www.google.com/m8/feeds/contacts/example%40gmail.com/full?alt\\u003djson\\u0026start-index\\u003d2\\u0026max-results\\u003d1"}],"author":[{"name":{"$t":"Jared Hanson"},"email":{"$t":"example@gmail.com"}}],"generator":{"version":"1.0","uri":"http://www.google.com/m8/feeds","$t":"Contacts"},"openSearch$totalResults":{"$t":"3"},"openSearch$startIndex":{"$t":"1"},"openSearch$itemsPerPage":{"$t":"1"},"entry":[{"id":{"$t":"http://www.google.com/m8/feeds/contacts/example%40gmail.com/base/0"},"updated":{"$t":"2009-09-30T01:58:35.769Z"},"category":[{"scheme":"http://schemas.google.com/g/2005#kind","term":"http://schemas.google.com/contact/2008#contact"}],"title":{"type":"text","$t":""},"link":[{"rel":"http://schemas.google.com/contacts/2008/rel#edit-photo","type":"image/*","href":"https://www.google.com/m8/feeds/photos/media/example%40gmail.com/0/0XXxxXXxXxXxx0XX0xXxXx"},{"rel":"http://schemas.google.com/contacts/2008/rel#photo","type":"image/*","href":"https://www.google.com/m8/feeds/photos/media/example%40gmail.com/0"},{"rel":"self","type":"application/atom+xml","href":"https://www.google.com/m8/feeds/contacts/example%40gmail.com/full/0"},{"rel":"edit","type":"application/atom+xml","href":"https://www.google.com/m8/feeds/contacts/example%40gmail.com/full/0/1111111111111000"}],"gd$email":[{"rel":"http://schemas.google.com/g/2005#other","address":"example+other@gmail.com","primary":"true"}]}]}}';
        
        callback(null, body, undefined);
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('token', 'token-secret', {}, done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'google');
        assert.equal(profile.id, 'example@gmail.com');
        assert.equal(profile.displayName, 'Jared Hanson');
        assert.equal(profile.emails[0].value, 'example@gmail.com');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },
  
  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new GoogleStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth.get = function(url, token, tokenSecret, callback) {
        callback(new Error('something went wrong'));
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('token', 'token-secret', {}, done);
        });
      },
      
      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should wrap error in InternalOAuthError' : function(err, req) {
        assert.equal(err.constructor.name, 'InternalOAuthError');
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      },
    },
  },

}).export(module);
