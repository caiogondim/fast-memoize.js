'use strict'

// 2nd attempt
// Let's optimize for “single argument” case

module.exports = function(target) {
  var memoized = function() {
    var cacheKey

    if (arguments.length === 1) {
      cacheKey = arguments[0]
    } else {
      cacheKey = JSON.stringify(arguments)
    }

    if (!(cacheKey in memoized._cache)) {
      memoized._cache[cacheKey] = target.apply(this, arguments)
    }

    return memoized._cache[cacheKey]
  }

  memoized._cache = {}

  return memoized
}
