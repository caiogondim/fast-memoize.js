'use strict'

module.exports = function(target) {
  return function() {
    var args = Array.prototype.slice.call(arguments)
    var cacheKey = JSON.stringify(args)
    var cache = {}

    if (!(cacheKey in cache)) {
      cache[cacheKey] = target.apply(this, args)
    }

    return cache[cacheKey]
  }
}
