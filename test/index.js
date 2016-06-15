'use strict'

const tap = require('tape')
const memoize = require('../src')

tap.test('speed', (test) => {
  // Vanilla Fibonacci

  function vanillaFibonacci (n) {
    return n < 2 ? n : vanillaFibonacci(n - 1) + vanillaFibonacci(n - 2)
  }

  const vanillaExecTimeStart = Date.now()
  vanillaFibonacci(35)
  const vanillaExecTime = Date.now() - vanillaExecTimeStart

  // Memoized

  let fibonacci = function (n) {
    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
  }

  fibonacci = memoize(fibonacci)
  const memoizedFibonacci = fibonacci

  const memoizedExecTimeStart = Date.now()
  memoizedFibonacci(35)
  const memoizedExecTime = Date.now() - memoizedExecTimeStart

  // Assertion

  test.ok(
    (memoizedExecTime < vanillaExecTime),
    'memoized function should be faster than original'
  )
  test.end()
})

tap.test('memoize functions with single arguments', (test) => {
  function plusPlus (number) {
    return number + 1
  }

  const memoizedPlusPlus = memoize(plusPlus)

  // Assertions

  test.equal(memoizedPlusPlus(1), 2, 'first run')
  test.equal(memoizedPlusPlus(1), 2, 'memoized run')
  test.end()
})

tap.test('memoize functions with N arguments', (test) => {
  function nToThePower (n, power) {
    return Math.pow(n, power)
  }

  const memoizedNToThePower = memoize(nToThePower)

  // Assertions

  test.equal(memoizedNToThePower(2, 3), 8, 'first run')
  test.equal(memoizedNToThePower(2, 3), 8, 'memoized run')
  test.end()
})

tap.test('inject custom cache', (test) => {
  'use strict'

  let hasMethodExecutionCount = 0
  let setMethodExecutionCount = 0

  // a custom cache instance must implement:
  // - has
  // - get
  // - set
  // - delete
  class CustomCache {
    constructor () {
      this._cache = Object.create(null)
      this._name = 'Object'
    }

    has (key) {
      hasMethodExecutionCount++
      return (key in this._cache)
    }

    get (key) {
      return this._cache[key]
    }

    set (key, value) {
      setMethodExecutionCount++
      this._cache[key] = value
    }

    delete (key) {
      delete this._cache[key]
    }
  }

  function minus (a, b) {
    return a - b
  }

  const memoizedMinus = memoize(minus, CustomCache)
  memoizedMinus(3, 1)
  memoizedMinus(3, 1)

  // Assertions

  test.equal(
    hasMethodExecutionCount,
    2,
    'cache.has method from custom cache should be called'
  )
  test.equal(
    setMethodExecutionCount,
    1,
    'set.has method from custom cache should be called'
  )
  test.end()
})

tap.test('inject custom serializer', (test) => {
  let serializerMethodExecutionCount = 0

  function serializer () {
    serializerMethodExecutionCount++
    return JSON.stringify(arguments)
  }

  function minus (a, b) {
    return a - b
  }

  const memoizedMinus = memoize(minus, null, serializer)
  memoizedMinus(3, 1)
  memoizedMinus(3, 1)

  // Assertions

  test.equal(
    serializerMethodExecutionCount,
    2,
    'custom serialized should be called'
  )
  test.end()
})
