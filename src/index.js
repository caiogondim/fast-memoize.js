//
// Main
//

module.exports = function memoize (fn, options) {
  const cache = options && options.cache
    ? options.cache
    : cacheDefault

  const serializer = options && options.serializer
    ? options.serializer
    : serializerDefault

  const ttl = options && +options.ttl
    ? +options.ttl
    : ttlDefault

  const strategy = options && options.strategy
    ? options.strategy
    : strategyDefault

  return strategy(fn, {
    cache,
    serializer,
    ttl
  })
}

//
// Strategy
//

const isPrimitive = (value) =>
  value === null || (typeof value !== 'function' && typeof value !== 'object')

function strategyDefault (fn, options) {
  function monadic (fn, cache, serializer, arg) {
    const cacheKey = isPrimitive(arg) ? arg : serializer(arg)

    if (!cache.has(cacheKey)) {
      const computedValue = fn.call(this, arg)
      cache.set(cacheKey, computedValue)
    }

    return cache.get(cacheKey)
  }

  function variadic (fn, cache, serializer, ...args) {
    const cacheKey = serializer(args)

    if (!cache.has(cacheKey)) {
      const computedValue = fn.apply(this, args)
      cache.set(cacheKey, computedValue)
    }

    return cache.get(cacheKey)
  }

  let memoized = fn.length === 1 ? monadic : variadic

  memoized = memoized.bind(
    this,
    fn,
    options.cache.create({
      ttl: options.ttl
    }),
    options.serializer
  )

  return memoized
}

//
// Serializer
//

const serializerDefault = (...args) => JSON.stringify(args)

const ttlDefault = false

//
// Cache
//

class ObjectWithoutPrototypeCache {
  constructor (opts) {
    this.cache = Object.create(null)
    this.preHas = () => {}
    this.preGet = () => {}

    if (opts.ttl) {
      const ttl = Math.min(24 * 60 * 60 * 1000, Math.max(1, opts.ttl)) // max of 24 hours, min of 1 ms
      const ttlKeyExpMap = {}

      this.preHas = (key) => {
        if (Date.now() > ttlKeyExpMap[key]) {
          delete ttlKeyExpMap[key]
          delete this.cache[key]
        }
      }
      this.preGet = (key) => {
        ttlKeyExpMap[key] = Date.now() + ttl
      }

      setInterval(() => {
        const now = Date.now()
        const keys = Object.keys(ttlKeyExpMap)
        // The assumption here is that the order of keys is oldest -> newest,
        // which coresponds to the order of soonest exp -> latest exp.
        // So, keep looping thru expiration times *until* a key that hasn't expired.
        keys.every((key) => {
          if (now > ttlKeyExpMap[key]) {
            delete ttlKeyExpMap[key]
            return true
          }
        })
      }, opts.ttl)
    }
  }

  has (key) {
    this.preHas(key)
    return (key in this.cache)
  }

  get (key) {
    this.preGet(key)
    return this.cache[key]
  }

  set (key, value) {
    this.cache[key] = value
  }
}

const cacheDefault = {
  create: (opts) => new ObjectWithoutPrototypeCache(opts)
}
