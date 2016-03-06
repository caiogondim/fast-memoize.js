'use strict'

const CacheDefault = require('./cache')
const serializerDefault = require('./serializer')

function memoize (fn, Cache, serializer) {
  if (!Cache) {
    Cache = CacheDefault
  }
  if (!serializer) {
    serializer = serializerDefault
  }

  function memoized () {
    let cacheKey

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

  return memoized
}

module.exports = memoize
