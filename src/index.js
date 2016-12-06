'use strict'

var cacheDefault = require('./cache/object')
var serializerDefault = require('./serializer/json-stringify')
var strategyDefault = require('./strategy/optimize-for-single-argument')

function memoize (fn, options) {
  var cache
  var serializer
  var strategy

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

  if (options && options.strategy) {
    strategy = options.strategy
  } else {
    strategy = strategyDefault
  }

  return strategy(fn, {
    cache,
    serializer
  })
}

module.exports = memoize
