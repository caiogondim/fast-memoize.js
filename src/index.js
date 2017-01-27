const util = require('util')
//
// Main
//

module.exports = function memoize (fn, options) {
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

//
// Strategy
//

function isPrimitive (value) {
  return value == null || (typeof value !== 'function' && typeof value !== 'object')
}

function strategyDefault (fn, options) {
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

  memoized = memoized.bind(
    this,
    fn,
    options.cache.create(),
    options.serializer
  )

  arguments[0] = memoized

  return memoized
}

//
// Serializer
//

function customReplacer(args) {
  var cache = [];
  const replacer = function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  }
  cache = null; // Enable garbage collection
  return replacer;
}

//
// Serializer
//

function serializerDefault(...args) {
  try {
    // try the fastest way first.
    return JSON.stringify(args)
  } catch (error) {
    if (error instanceof TypeError &&
      error.message === 'Converting circular structure to JSON') {
      // if node
      if (util && util.inspect) {
        return JSON.stringify(util.inspect(args))
      } else {
        return JSON.stringify(args, customReplacer)
      }
    } else {
      throw e; // let others bubble up
    }
  }
}

//
// Cache
//

class ObjectWithoutPrototypeCache {
  constructor () {
    this.cache = Object.create(null)
  }

  has (key) {
    return (key in this.cache)
  }

  get (key) {
    return this.cache[key]
  }

  set (key, value) {
    this.cache[key] = value
  }

  delete (key) {
    delete this.cache[key]
  }
}

const cacheDefault = {
  create: () => new ObjectWithoutPrototypeCache()
}
