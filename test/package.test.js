var strategy = require('..');

describe('passport-oauth', function() {
  
  it('should export Strategy constructors', function() {
    expect(strategy.OAuthStrategy).to.be.a('function');
    expect(strategy.OAuth2Strategy).to.be.a('function');
  });
  
  it('should alias Strategy to OAuthStrategy', function() {
    expect(strategy.Strategy).to.equal(strategy.OAuthStrategy);
  });
  
});
