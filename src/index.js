'use strict'

var cacheDefault = require('./cache')
var serializerDefault = require('./serializer')

function ttlCheck (cacheKey, memoized, ttl) {
  const dataTime = memoized._ttlcache.get(cacheKey)
  if (ttl && dataTime && Date.now() - dataTime < ttl) {
    return true
  }
  // if it's not true then delete the key (if it exists) and return false
  memoized._cache.delete(cacheKey)
  return false
}

function checkKeyFactory (key, now, memo) {
  return function () {
    // if the ttl hasn't been updated since we last accessed it then it needs to
    // be removed. If it has been then we don't need to do anything.
    if (memo._ttlcache.get(key) === now) {
      memo._cache.delete(key)
      memo._ttlcache.delete(key)
    }
  }
}

function memoize (fn, options) {
  var cache
  var serializer
  var ttlCheckIfOk
  var ttl

  if (options && options.cache) {
    cache = options.cache
  } else {
    cache = cacheDefault
  }

  if (options && options.serializer) {
    serializer = options.serializer
  } else {
    serializer = serializerDefault
  }

  if (options && options.ttl) {
    ttlCheckIfOk = ttlCheck
    ttl = options.ttl
  } else {
    ttl = false
    ttlCheckIfOk = function () {
      return true
    }
  }

  function memoized () {
    var cacheKey
    var now

    if (arguments.length === 1) {
      cacheKey = arguments[0]
    } else {
      cacheKey = serializer(arguments)
    }

    if (!memoized._cache.has(cacheKey) || !ttlCheckIfOk(cacheKey, memoized, ttl)) {
      memoized._cache.set(cacheKey, fn.apply(this, arguments))
      if (ttl) {
        now = Date.now()
        memoized._ttlcache.set(cacheKey, now)
        if (options.autoExpire) {
          setTimeout(checkKeyFactory(cacheKey, now, memoized), ttl)
        }
      }
    }

    return memoized._cache.get(cacheKey)
  }

  memoized._cache = cache.create()
  memoized._ttlcache = cache.create()

  return memoized
}

module.exports = memoize
