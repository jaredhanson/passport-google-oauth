var vows = require('vows');
var assert = require('assert');
var util = require('util');
var GoogleStrategy = require('passport-google-oauth/oauth2');


vows.describe('GoogleStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new GoogleStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
    },
    
    'should be named google': function (strategy) {
      assert.equal(strategy.name, 'google');
    },
  },
  
  'strategy authorization params': {
    topic: function() {
      return new GoogleStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
    },
    
    'should return empty object when parsing invalid options': function (strategy) {
      var params = strategy.authorizationParams({ foo: 'bar' });
      assert.lengthOf(Object.keys(params), 0);
    },
    'should return access_type': function (strategy) {
      var params = strategy.authorizationParams({ accessType: 'offline' });
      assert.equal(params.access_type, 'offline');
    },
    'should return approval_prompt': function (strategy) {
      var params = strategy.authorizationParams({ approvalPrompt: 'force' });
      assert.equal(params.approval_prompt, 'force');
    },
    'should return prompt': function (strategy) {
      var params = strategy.authorizationParams({ prompt: 'consent' });
      assert.equal(params.prompt, 'consent');
    },
    'should return login_hint': function (strategy) {
      var params = strategy.authorizationParams({ loginHint: 'bob@gmail.com' });
      assert.equal(params.login_hint, 'bob@gmail.com');
    },
    'should return user_id': function (strategy) {
      var params = strategy.authorizationParams({ userID: 'bob@gmail.com' });
      assert.equal(params.user_id, 'bob@gmail.com');
    },
    'should return hd from hostedDomain option': function (strategy) {
      var params = strategy.authorizationParams({ hostedDomain: 'mycollege.edu' });
      assert.equal(params.hd, 'mycollege.edu');
    },
    'should return hd from hd option': function (strategy) {
      var params = strategy.authorizationParams({ hd: 'mycollege.edu' });
      assert.equal(params.hd, 'mycollege.edu');
    },
    'should return display from display option': function (strategy) {
      var params = strategy.authorizationParams({ display: 'touch' });
      assert.equal(params.display, 'touch');
    },
    'should return access_type and approval_prompt': function (strategy) {
      var params = strategy.authorizationParams({ accessType: 'offline', approvalPrompt: 'force' });
      assert.equal(params.access_type, 'offline');
      assert.equal(params.approval_prompt, 'force');
    },
  },
  
  'strategy when loading user profile': {
    topic: function() {
      var strategy = new GoogleStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.get = function(url, accessToken, callback) {
        var body = '{ \
 "kind": "plus#person",\
 "occupation": "Software Engineer",\
 "gender": "male",\
 "emails": [\
  {\
    "value": "example@gmail.com",\
    "type": "account"\
  }\
 ],\
 "urls": [\
  {\
   "value": "http://www.jaredhanson.net/",\
   "type": "otherProfile",\
   "label": "Jared Hanson"\
  }\
 ],\
 "objectType": "person",\
 "id": "111111111111111111111",\
 "displayName": "Jared Hanson",\
 "name": {\
  "familyName": "Hanson",\
  "givenName": "Jared"\
 },\
 "url": "https://plus.google.com/+JaredHanson",\
 "image": {\
  "url": "https://lh5.googleusercontent.com/-AAAAA-AAAAA/AAAAAAAAAAA/AAAAAAAAAAA/AAAAAAAAAAA/photo.jpg?sz=50",\
  "isDefault": false\
 },\
 "organizations": [\
  {\
   "name": "South Dakota School of Mines & Technology",\
   "type": "school",\
   "primary": false\
  }\
 ],\
 "placesLived": [\
  {\
   "value": "Berkeley, CA",\
   "primary": true\
  }\
 ],\
 "isPlusUser": true,\
 "language": "en",\
 "circledByCount": 77,\
 "verified": false\
}';
        
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
          strategy.userProfile('access-token', done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'google');
        assert.equal(profile.id, '111111111111111111111');
        assert.equal(profile.displayName, 'Jared Hanson');
        assert.equal(profile.name.familyName, 'Hanson');
        assert.equal(profile.name.givenName, 'Jared');
        assert.equal(profile.emails[0].value, 'example@gmail.com');
        assert.equal(profile.emails[0].type, 'account');
        assert.equal(profile.photos[0].value, 'https://lh5.googleusercontent.com/-AAAAA-AAAAA/AAAAAAAAAAA/AAAAAAAAAAA/AAAAAAAAAAA/photo.jpg?sz=50');
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
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.get = function(url, accessToken, callback) {
        callback(new Error('something-went-wrong'));
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
          strategy.userProfile('access-token', done);
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
