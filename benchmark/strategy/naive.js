export default function strategy (fn, options) {
  function memoized () {
    const cacheKey = options.serializer(arguments)

    if (!memoized.cache.has(cacheKey)) {
      memoized.cache.set(cacheKey, fn.apply(this, arguments))
    }

    return memoized.cache.get(cacheKey)
  }

  memoized.cache = options.cache.create()
  memoized.label = 'strategy: Naive, cache: ' + options.cache.label + ', serializer: ' + options.serializer.label

  return memoized
}

strategy.label = 'Naive'
