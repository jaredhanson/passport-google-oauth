/**
 * Module dependencies.
 */
var OAuthStrategy = require('./oauth');
var OAuth2Strategy = require('passport-google-oauth20')


/**
 * Framework version.
 */
require('pkginfo')(module, 'version');

/**
 * Expose constructors.
 */
exports.Strategy =
exports.OAuthStrategy = OAuthStrategy;
exports.OAuth2Strategy = OAuth2Strategy;
