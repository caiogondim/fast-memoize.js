function isPrimitive (value) {
  return value == null || (typeof value !== 'function' && typeof value !== 'object')
}

export default function strategy (fn, options) {
  function monadic () {
    let cacheKey
    if (isPrimitive(arguments[0])) {
      cacheKey = arguments[0]
    } else {
      cacheKey = options.serializer(arguments)
    }

    if (!memoized.cache.has(cacheKey)) {
      memoized.cache.set(cacheKey, fn.apply(this, arguments))
    }

    return memoized.cache.get(cacheKey)
  }

  function variadic () {
    const cacheKey = options.serializer(arguments)

    if (!memoized.cache.has(cacheKey)) {
      memoized.cache.set(cacheKey, fn.apply(this, arguments))
    }

    return memoized.cache.get(cacheKey)
  }

  const memoized = fn.length === 1
    ? monadic
    : variadic

  memoized.cache = options.cache.create()
  memoized.label = 'strategy: Infer arity, cache: ' + options.cache.label + ', serializer: ' + options.serializer.label

  return memoized
}

strategy.label = 'Infer arity'
