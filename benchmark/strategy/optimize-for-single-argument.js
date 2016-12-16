function strategy (fn, options) {
  function memoized () {
    var cacheKey

    if (arguments.length === 1) {
      cacheKey = arguments[0]
    } else {
      cacheKey = options.serializer(arguments)
    }

    if (!memoized._cache.has(cacheKey)) {
      memoized._cache.set(cacheKey, fn.apply(this, arguments))
    }

    return memoized._cache.get(cacheKey)
  }

  memoized._cache = options.cache.create()
  memoized._name = 'strategy: Optimize for single argument, cache: ' + options.cache.name + ', serializer: ' + options.serializer._name

  return memoized
}

strategy.label = 'Optimize for single argument'

module.exports = strategy
