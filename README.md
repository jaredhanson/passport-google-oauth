# passport-google-oauth

[![Build](https://img.shields.io/travis/jaredhanson/passport-google-oauth.svg)](https://travis-ci.org/jaredhanson/passport-google-oauth)
[![Coverage](https://img.shields.io/coveralls/jaredhanson/passport-google-oauth.svg)](https://coveralls.io/r/jaredhanson/passport-google-oauth)
[![Quality](https://img.shields.io/codeclimate/github/jaredhanson/passport-google-oauth.svg?label=quality)](https://codeclimate.com/github/jaredhanson/passport-google-oauth)
[![Dependencies](https://img.shields.io/david/jaredhanson/passport-google-oauth.svg)](https://david-dm.org/jaredhanson/passport-google-oauth)


[Passport](http://passportjs.org/) strategies for authenticating with [Google](http://www.google.com/)
using OAuth 1.0a and OAuth 2.0.

This is a meta-module that combines [passport-google-oauth1](https://github.com/jaredhanson/passport-google-oauth1)
and [passport-google-oauth20](https://github.com/jaredhanson/passport-google-oauth2).
It exists for backwards-compatibility with applications making use of the
combined package.  As of version 1.0.0, it is encouraged to declare dependencies
on the module that implements the specific version of OAuth needed.

## Install

    $ npm install passport-google-oauth

## Contributing

#### Tests

The test suite is located in the `test/` directory.  All new features are
expected to have corresponding test cases.  Ensure that the complete test suite
passes by executing:

```bash
$ make test
```

#### Coverage

The test suite covers 100% of the code base.  All new feature development is
expected to maintain that level.  Coverage reports can be viewed by executing:

```bash
$ make test-cov
$ make view-cov
```

## Support

#### Funding

This software is provided to you as open source, free of charge.  The time and
effort to develop and maintain this project is dedicated by [@jaredhanson](https://github.com/jaredhanson).
If you (or your employer) benefit from this project, please consider a financial
contribution.  Your contribution helps continue the efforts that produce this
and other open source software.

Funds are accepted via [PayPal](https://paypal.me/jaredhanson), [Venmo](https://venmo.com/jaredhanson),
and [other](http://jaredhanson.net/pay) methods.  Any amount is appreciated.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2012-2016 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
