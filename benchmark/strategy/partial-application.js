// This strategy is an improvement over `infer-arity`

function isPrimitive (value) {
  return value == null || (typeof value !== 'function' && typeof value !== 'object')
}

function parcialApplication (fn, options) {
  function monadic (fn, cache, serializer, arg) {
    var cacheKey
    if (isPrimitive(arg)) {
      cacheKey = arg
    } else {
      cacheKey = serializer(arg)
    }

    if (!cache.has(cacheKey)) {
      var computedValue = fn.call(this, arg)
      cache.set(cacheKey, computedValue)
      return computedValue
    }

    return cache.get(cacheKey)
  }

  function variadic (fn, cache, serializer, ...args) {
    var cacheKey = serializer(args)

    if (!cache.has(cacheKey)) {
      var computedValue = fn.apply(this, args)
      cache.set(cacheKey, computedValue)
      return computedValue
    }

    return cache.get(cacheKey)
  }

  var memoized = fn.length === 1
    ? monadic
    : variadic

  memoized = memoized.bind(this, fn, options.cache.create(), options.serializer)
  memoized._name = 'strategy: Partial application, cache: ' + options.cache.name + ', serializer: ' + options.serializer._name

  return memoized
}

module.exports = parcialApplication