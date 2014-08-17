# Passport-Google-OAuth

[Passport](http://passportjs.org/) strategies for authenticating with [Google](http://www.google.com/)
using ONLY OAuth 2.0.

This module lets you authenticate using Google in your Node.js applications.
By plugging into Passport, Google authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install kroknet-passport-google-oauth

## Usage of OAuth 2.0

#### Configure Strategy

The Google OAuth 2.0 authentication strategy authenticates users using a Google
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

```Javascript
var GoogleStrategy = require( 'kroknet-passport-google-oauth' ).Strategy;

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://yourdormain:3000/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```

#### Note about Local environment 

Avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication.

A workaround consist to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/ for the callback
then edit your /etc/hosts on your computer and/or vm to point on your private IP. 

Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and it will lead to lost your session

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'google'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```Javascript
app.get('/auth/google',
  passport.authenticate('google', { scope: 
  	'https://www.googleapis.com/auth/plus.login',
  	'https://www.googleapis.com/auth/plus.profile.emails.read' }
));

app.get( '/auth/google/callback', 
	passport.authenticate( 'google', { 
		successRedirect: '/auth/google/success',
		failureRedirect: '/auth/google/failure'
}));
```

#### What you will get in profile response ? 

```
   provider         always set to `google`
   id
   name
   displayName
   birthday
   relationship
   isPerson
   isPlusUser
   placesLived
   language
   emails
   gender
   picture
```

## Examples

For a complete, working example, refer to the [OAuth 2.0 example](https://github.com/estebita/passport-google-oauth/tree/master/examples/oauth2).

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2012-2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
