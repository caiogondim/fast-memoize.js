//
// Main
//

export function memoize (fn, options) {
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
    cache: cache,
    serializer: serializer
  })
}

//
// Strategy
//

function isPrimitive (value) {
  return value == null || typeof value === 'number' || typeof value === 'boolean' // || typeof value === "string" 'unsafe' primitive for our needs
}

function monadic (fn, cache, serializer, arg) {
  const cacheKey = isPrimitive(arg) ? arg : serializer(arg)

  let computedValue = cache.get(cacheKey)
  if (typeof computedValue === 'undefined') {
    computedValue = fn.call(this, arg)
    cache.set(cacheKey, computedValue)
  }

  return computedValue
}

function variadic (fn, cache, serializer) {
  const args = Array.prototype.slice.call(arguments, 3)
  const cacheKey = serializer(args)

  let computedValue = cache.get(cacheKey)
  if (typeof computedValue === 'undefined') {
    computedValue = fn.apply(this, args)
    cache.set(cacheKey, computedValue)
  }

  return computedValue
}

function assemble (fn, context, strategy, cache, serialize) {
  return strategy.bind(
    context,
    fn,
    cache,
    serialize
  )
}

function strategyDefault (fn, options) {
  const strategy = fn.length === 1 ? monadic : variadic

  return assemble(
    fn,
    this,
    strategy,
    options.cache.create(),
    options.serializer
  )
}

function strategyVariadic (fn, options) {
  const strategy = variadic

  return assemble(
    fn,
    this,
    strategy,
    options.cache.create(),
    options.serializer
  )
}

function strategyMonadic (fn, options) {
  const strategy = monadic

  return assemble(
    fn,
    this,
    strategy,
    options.cache.create(),
    options.serializer
  )
}

//
// Serializer
//

export function serializerDefault () {
  return JSON.stringify(arguments)
}

//
// Cache
//

export const cacheDefault = {
  create: function create () {
    return new Map()
  }
}

//
// API
//

export const strategies = {
  variadic: strategyVariadic,
  monadic: strategyMonadic
}
