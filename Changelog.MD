# 2.0

On March 7, 2019, Google shut down legacy Google+ APIs.

Accordingly, Google+ Sign-In is deprecated and it is recommended that developers migrate to Google Sign-In.

Version 2.0.0 of passport-google-oauth20 has been published to facilitate this migration.

**No code changes are necessary**.

Behind the scenes, user profile information is obtained from the userinfo endpoint, replacing the legacy people.get API.

More info [here](https://medium.com/passportjs/google-api-shutdown-330c3b47e3df).
