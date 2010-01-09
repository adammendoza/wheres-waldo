var redisclient = require('redisclient'),
    whereswaldo = require('../lib'),
         assert = require('assert'),
            sys = require('sys'),
          redis = new redisclient.Client();

process.mixin(GLOBAL, require('ntest'))

describe("new waldo instance")
  before(function() {
    this.waldo = whereswaldo.create(redis);
  })

  it("has a default prefix", function() {
    assert.equal('waldo', this.waldo.prefix)
  })

  it('sets redis instance', function() {
    assert.equal(redis, this.waldo.redis)
  })

  it('does not know where a user is', function() {
    assert.ok(!this.waldo.locate('fred').wait())
  })

  it('returns no users for an empty location', function() {
    var users = this.waldo.list('home').wait();
    assert.equal(0, users.length)
  })

describe("custom new waldo instance")
  it('has a custom prefix', function() {
    waldo = whereswaldo.create(redis, 'custom')
    assert.equal('custom', waldo.prefix)
  })

describe("tracking a user")
  before(function() {
    this.waldo = whereswaldo.create(redis, 'tracking');
    this.waldo.track('bob', 'gym')
  })

  it("tracks a user's location", function() {
    assert.equal('gym', this.waldo.locate('bob').wait())
  })

  it("lists the user in that location", function() {
    assert.equal('bob', this.waldo.list('gym').wait()[0])
  })