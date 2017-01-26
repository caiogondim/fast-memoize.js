function memoize(fn, monadic = fn.length === 1, cache = {}) {
  return function memoized(...args) {
    const key = monadic ? args[0] : JSON.stringify(args)
    if (cache[key]) { return cache[key] }
    return cache[key] = fn(...args)
  }
}

module.exports = memoize
