//
// main
//

module.exports = function memoize (fn, options) {
  let cache = options && options.cache
    ? options.cache
    : cacheDefault

  let serializer = options && options.serializer
    ? options.serializer
    : serializerDefault

  let strategy = options && options.strategy
    ? options.strategy
    : strategyDefault

  return strategy(fn, {
    cache: cache,
    serializer: serializer
  })
}

//
// strategy
//

function isPrimitive (value) {
  return value == null || (typeof value !== 'function' && typeof value !== 'object')
}

function monadic (fn, cache, serializer, arg) {
  let cacheKey = isPrimitive(arg) ? arg : serializer(arg)

  if (!cache.has(cacheKey)) {
    let computedValue = fn.call(this, arg)
    cache.set(cacheKey, computedValue)

    return computedValue
  }

  return cache.get(cacheKey)
}

function variadic (fn, cache, serializer) {
  let args = Array.prototype.slice.call(arguments, 3)
  let cacheKey = serializer(args)

  if (!cache.has(cacheKey)) {
    let computedValue = fn.apply(this, args)
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
// serializer
//

function serializerDefault () {
  return JSON.stringify(arguments)
}

//
// cache
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

var cacheDefault = {
  create: function create () {
    return new ObjectWithoutPrototypeCache()
  }
}
