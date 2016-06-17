'use strict'

var cacheDefault = require('./cache')
var serializerDefault = require('./serializer')

function memoize (fn, cache, serializer) {
  if (!cache) {
    cache = cacheDefault
  }
  if (!serializer) {
    serializer = serializerDefault
  }

  function memoized () {
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

  memoized._cache = cache.create()

  return memoized
}

module.exports = memoize
