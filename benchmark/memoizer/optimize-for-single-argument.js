'use strict'

module.exports = function(fn, Cache, resolver) {

  var memoized = function() {
    var cacheKey

    if (arguments.length === 1) {
      cacheKey = arguments[0]
    } else {
      cacheKey = resolver(arguments)
    }

    if (!memoized._cache.has(cacheKey)) {
      memoized._cache.set(cacheKey, fn.apply(this, arguments))
    }

    return memoized._cache.get(cacheKey)
  }

  memoized._cache = new Cache()
  memoized._name = 'memoizer: Optimize for single argument, cache: ' + memoized._cache._name + ', resolver: ' + resolver._name

  return memoized
}
