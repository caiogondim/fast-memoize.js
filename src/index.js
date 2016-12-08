//
// Strategy
//

function strategyDefault (fn, options) {
  function monadic (fn, cache, serializer, arg) {
    if (!cache.has(arg)) {
      cache.set(arg, fn.call(this, arg))
    }

    return cache.get(arg)
  }

  function variadic (fn, cache, serializer, ...args) {
    var cacheKey = serializer(args)

    if (!cache.has(cacheKey)) {
      cache.set(cacheKey, fn.apply(this, args))
    }

    return cache.get(cacheKey)
  }

  var memoized = fn.length === 1
    ? monadic
    : variadic

  memoized = memoized.bind(this, fn, options.cache.create(), options.serializer)
  memoized._name = 'strategy: Infer arity, cache: ' + options.cache.name + ', serializer: ' + options.serializer._name

  return memoized
}

//
// Serializer
//

function serializerDefault () {
  return JSON.stringify(arguments)
}

serializerDefault._name = 'jsonStringify'

//
// Cache
//

class ObjectWithoutPrototypeCache {
  constructor () {
    this._cache = Object.create(null)
  }

  has (key) {
    return (key in this._cache)
  }

  get (key) {
    return this._cache[key]
  }

  set (key, value) {
    this._cache[key] = value
  }

  delete (key) {
    delete this._cache[key]
  }
}

const cacheDefault = {
  create: () => new ObjectWithoutPrototypeCache(),
  name: 'Object without prototype'
}

//
// Main
//

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
