'use strict'

// 3rd attempt
// Using Map as cache

module.exports = function(target) {
  var memoized = function() {
    var cacheKey

    if (arguments.length === 1) {
      cacheKey = arguments[0]
    } else {
      cacheKey = JSON.stringify(arguments)
    }

    if (!memoized._cache.has(cacheKey)) {
      memoized._cache.set(cacheKey, target.apply(this, arguments))
    }

    return memoized._cache.get(cacheKey)
  }

  memoized._cache = new Map()

  return memoized
}
