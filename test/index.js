'use strict'

var tap = require('tape')
var memoize = require('../src')

tap.test('speed', function (test) {
  // Vanilla Fibonacci

  function vanillaFibonacci (n) {
    return n < 2 ? n : vanillaFibonacci(n - 1) + vanillaFibonacci(n - 2)
  }

  var vanillaExecTimeStart = Date.now()
  vanillaFibonacci(35)
  var vanillaExecTime = Date.now() - vanillaExecTimeStart

  // Memoized

  var fibonacci = function (n) {
    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
  }

  fibonacci = memoize(fibonacci)
  var memoizedFibonacci = fibonacci

  var memoizedExecTimeStart = Date.now()
  memoizedFibonacci(35)
  var memoizedExecTime = Date.now() - memoizedExecTimeStart

  // Assertion

  test.ok(
    (memoizedExecTime < vanillaExecTime),
    'memoized function should be faster than original'
  )
  test.end()
})

tap.test('memoize functions with single arguments', function (test) {
  function plusPlus (number) {
    return number + 1
  }

  var memoizedPlusPlus = memoize(plusPlus)

  // Assertions

  test.equal(memoizedPlusPlus(1), 2, 'first run')
  test.equal(memoizedPlusPlus(1), 2, 'memoized run')
  test.end()
})

tap.test('memoize functions with N arguments', function (test) {
  function nToThePower (n, power) {
    return Math.pow(n, power)
  }

  var memoizedNToThePower = memoize(nToThePower)

  // Assertions

  test.equal(memoizedNToThePower(2, 3), 8, 'first run')
  test.equal(memoizedNToThePower(2, 3), 8, 'memoized run')
  test.end()
})

tap.test('inject custom cache', function (test) {
  'use strict'

  var hasMethodExecutionCount = 0
  var setMethodExecutionCount = 0

  // a custom cache instance must implement:
  // - has
  // - get
  // - set
  // - delete
  var customCacheProto = {
    has: function (key) {
      hasMethodExecutionCount++
      return (key in this._cache)
    },
    get: function (key) {
      return this._cache[key]
    },
    set: function (key, value) {
      setMethodExecutionCount++
      this._cache[key] = value
    },
    delete: function (key) {
      delete this._cache[key]
    },
    _name: 'Object'
  }
  var customCache = {
    create: function () {
      var cache = Object.create(customCacheProto)
      cache._cache = Object.create(null)
      return cache
    }
  }

  function minus (a, b) {
    return a - b
  }

  var memoizedMinus = memoize(minus, {
    cache: customCache
  })
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

tap.test('inject custom serializer', function (test) {
  var serializerMethodExecutionCount = 0

  function serializer () {
    serializerMethodExecutionCount++
    return JSON.stringify(arguments)
  }

  function minus (a, b) {
    return a - b
  }

  var memoizedMinus = memoize(minus, {
    serializer: serializer
  })
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
