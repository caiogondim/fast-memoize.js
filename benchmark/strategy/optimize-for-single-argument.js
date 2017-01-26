function isPrimitive (value) {
  return value == null || (typeof value !== 'function' && typeof value !== 'object')
}

function strategy (fn, options) {
  function memoized () {
    var cacheKey

    if (arguments.length === 1 && isPrimitive(arguments[0])) {
      cacheKey = arguments[0]
    } else {
      cacheKey = options.serializer(arguments)
    }

    if (!memoized.cache.has(cacheKey)) {
      memoized.cache.set(cacheKey, fn.apply(this, arguments))
    }

    return memoized.cache.get(cacheKey)
  }

  memoized.cache = options.cache.create()
  memoized.label = 'strategy: Optimize for single argument, cache: ' + options.cache.label + ', serializer: ' + options.serializer.label

  return memoized
}

strategy.label = 'Optimize for single argument'

module.exports = strategy
