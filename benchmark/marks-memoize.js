function memoize(fn, cache = {}, monadic = fn.length === 1) {

  function isPrimitive(value) { return value == null || (typeof value !== 'function' && typeof value !== 'object') }

  return function memoized(first, ...args) {
    const key = monadic && isPrimitive(first) ? first : JSON.stringify([first, ...args])
    if (cache[key]) { return cache[key] }
    return cache[key] = fn(first, ...args)
  }
}

module.exports = memoize
