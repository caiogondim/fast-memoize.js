'use strict'

module.exports = function(fn, Cache, serializer) {

  var memoized = function() {
    var cacheKey

    if (arguments.length === 1) {
      cacheKey = arguments[0]
    } else {
      cacheKey = serializer(arguments)
    }

    if (!memoized._cache.has(cacheKey)) {
      memoized._cache.set(cacheKey, fn.apply(this, arguments))
    }

    return memoized._cache.get(cacheKey)
  }

  memoized._cache = new Cache()
  memoized._name = 'memoizer: Optimize for single argument, cache: ' + memoized._cache._name + ', serializer: ' + serializer._name

  return memoized
}
