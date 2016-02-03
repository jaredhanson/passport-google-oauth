/**
 * Module dependencies.
 */
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , util = require('util')
  , GooglePlusProfile = require('./profile/googleplus')
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;

var DEPRECATED_SCOPES = {
  'https://www.googleapis.com/auth/userinfo.profile': 'profile',
  'https://www.googleapis.com/auth/userinfo.email': 'email',
};

/**
 * `Strategy` constructor.
 *
 * The Google authentication strategy authenticates requests by delegating to
 * Google using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Google application's client id
 *   - `clientSecret`  your Google application's client secret
 *   - `callbackURL`   URL to which Google will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new GoogleStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/google/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://accounts.google.com/o/oauth2/v2/auth';
  options.tokenURL = options.tokenURL || 'https://www.googleapis.com/oauth2/v4/token';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'google';
  this._userProfileURL = options.userProfileURL || 'https://www.googleapis.com/plus/v1/people/me';
  
  //warn deprecated scopes
  if (this._scope) {
    var scopes = Array.isArray(this._scope) ? this._scope : [ this._scope ];
    scopes.forEach(function(scope) {
      var alt = DEPRECATED_SCOPES[scope];
      if (!alt) return;
      console.warn(scope + ' is deprecated. Switch to ' + alt);
    });
  }
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Google.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `google`
 *   - `id`
 *   - `username`
 *   - `displayName`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  // TODO: Switch to new URL:
  // https://www.googleapis.com/oauth2/v3/userinfo
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

    try {
      var json = JSON.parse(body)
        , i, len;

      var profile = GooglePlusProfile.parse(json);
      profile.provider = 'google';
      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

/**
 * Return extra Google-specific parameters to be included in the authorization
 * request.
 *
 * @param {Object} options
 * @return {Object}
 * @api protected
 */
Strategy.prototype.authorizationParams = function(options) {
  var params = {};
  
  // https://developers.google.com/identity/protocols/OAuth2WebServer
  if (options.accessType) {
    params['access_type'] = options.accessType;
  }
  if (options.prompt) {
    params['prompt'] = options.prompt;
  }
  if (options.loginHint) {
    params['login_hint'] = options.loginHint;
  }
  if (options.includeGrantedScopes) {
    params['include_granted_scopes'] = true;
  }
  
  // https://developers.google.com/identity/protocols/OpenIDConnect
  if (options.display) {
    // Specify what kind of display consent screen to display to users.
    //   https://developers.google.com/accounts/docs/OpenIDConnect#authenticationuriparameters
    params['display'] = options.display;
  }
  
  // Google Apps for Work
  if (options.hostedDomain || options.hd) {
    // This parameter is derived from Google's OAuth 1.0 endpoint, and (although
    // undocumented) is supported by Google's OAuth 2.0 endpoint was well.
    //   https://developers.google.com/accounts/docs/OAuth_ref
    params['hd'] = options.hostedDomain || options.hd;
  }
  
  // Google+
  if (options.requestVisibleActions) {
    // Space separated list of allowed app actions
    // as documented at:
    //  https://developers.google.com/+/web/app-activities/#writing_an_app_activity_using_the_google_apis_client_libraries
    //  https://developers.google.com/+/api/moment-types/
    params['request_visible_actions'] = options.requestVisibleActions;
  }
  
  // OpenID 2.0 migration
  if (options.openIDRealm) {
    // This parameter is needed when migrating users from Google's OpenID 2.0 to OAuth 2.0
    //   https://developers.google.com/accounts/docs/OpenID?hl=ja#adjust-uri
    params['openid.realm'] = options.openIDRealm;
  }
  
  // Undocumented
  if (options.approvalPrompt) {
    params['approval_prompt'] = options.approvalPrompt;
  }
  if (options.userID) {
    // Undocumented, but supported by Google's OAuth 2.0 endpoint.  Appears to
    // be equivalent to `login_hint`.
    params['user_id'] = options.userID;
  }
  
  return params;
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
