'use strict'

module.exports = function memoizer1(fn, Cache, serializer) {

  var memoized = function() {
    var cacheKey = serializer(arguments)

    if (!memoized._cache.has(cacheKey)) {
      memoized._cache.set(cacheKey, fn.apply(this, arguments))
    }

    return memoized._cache.get(cacheKey)
  }

  memoized._cache = new Cache()
  memoized._name = 'strategy: Naive, cache: ' + memoized._cache._name + ', serializer: ' + serializer._name

  return memoized
}
