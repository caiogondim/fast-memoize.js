function strategy (fn, options) {
  function memoized () {
    var cacheKey

    cacheKey = options.serializer(arguments)

    if (!memoized._cache.has(cacheKey)) {
      memoized._cache.set(cacheKey, fn.apply(this, arguments))
    }

    return memoized._cache.get(cacheKey)
  }

  memoized._cache = options.cache.create()
  memoized._name = 'strategy: Naive, cache: ' + options.cache.name + ', serializer: ' + options.serializer._name

  return memoized
}

module.exports = strategy
