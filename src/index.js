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

  const strategy = options && options.strategy
    ? options.strategy
    : strategyDefault

  return strategy(fn, {
    cache,
    serializer
  })
}

//
// Strategy
//

const isPrimitive = (value) =>  
  (typeof value !== 'function' && typeof value !== 'object')

function monadic (fn, cache, serializer, arg) {
  const cacheKey = isPrimitive(arg) ? arg : serializer(arg)

  if (!cache.has(cacheKey)) {
    var computedValue = fn.call(this, arg)
    cache.set(cacheKey, computedValue)
    return computedValue
  }

  return cache.get(cacheKey)
}

function variadic (fn, cache, serializer) {
  const args = Array.prototype.slice.call(arguments, 3)
  const cacheKey = serializer(args)

  if (!cache.has(cacheKey)) {
    const computedValue = fn.apply(this, args)
    cache.set(cacheKey, computedValue)
    return computedValue
  }

  return cache.get(cacheKey)
}

function strategyDefault (fn, options) {
  let memoized = fn.length === 1 ? monadic : variadic

  memoized = memoized.bind(
    this,
    fn,
    options.cache.create(),
    options.serializer
  )

  return memoized
}

//
// Serializer
//

function serializerDefault () {
  return JSON.stringify(arguments)
}

//
// Cache
//

function ObjectWithoutPrototypeCache () {
  this.cache = Object.create(null)
}

ObjectWithoutPrototypeCache.prototype.has = function (key) {
  return (key in this.cache)
}

ObjectWithoutPrototypeCache.prototype.get = function (key) {
  return this.cache[key]
}

ObjectWithoutPrototypeCache.prototype.set = function (key, value) {
  this.cache[key] = value
}

const cacheDefault = {
  create: () => new ObjectWithoutPrototypeCache()
}
