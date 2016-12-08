//
// Strategy
//

function strategyDefault (fn, options) {
  function monadic () {
    var cacheKey = arguments[0]

    if (!memoized._cache.has(cacheKey)) {
      memoized._cache.set(cacheKey, fn.apply(this, arguments))
    }

    return memoized._cache.get(cacheKey)
  }

  function variadic () {
    var cacheKey = options.serializer(arguments)

    if (!memoized._cache.has(cacheKey)) {
      memoized._cache.set(cacheKey, fn.apply(this, arguments))
    }

    return memoized._cache.get(cacheKey)
  }

  var memoized = fn.length === 1
    ? monadic
    : variadic

  memoized._cache = options.cache.create()
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
