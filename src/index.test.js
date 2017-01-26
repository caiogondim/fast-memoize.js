/* global test, expect */

var memoize = require('../src')

test('speed', function () {
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

  expect(memoizedExecTime < vanillaExecTime).toBe(true)
})

test('memoize functions with single primitive argument', function () {
  function plusPlus (number) {
    return number + 1
  }

  var memoizedPlusPlus = memoize(plusPlus)

  // Assertions

  expect(memoizedPlusPlus(1)).toBe(2)
  expect(memoizedPlusPlus(1)).toBe(2)
})

test('memoize functions with single non-primitive argument', function () {
  var numberOfCalls = 0
  function plusPlus (obj) {
    numberOfCalls += 1
    return obj.number + 1
  }

  var memoizedPlusPlus = memoize(plusPlus)

  // Assertions
  expect(memoizedPlusPlus({number: 1})).toBe(2)
  expect(numberOfCalls).toBe(1)
  expect(memoizedPlusPlus({number: 1})).toBe(2)
  expect(numberOfCalls).toBe(1)
})

test('memoize functions with N arguments', function () {
  function nToThePower (n, power) {
    return Math.pow(n, power)
  }

  var memoizedNToThePower = memoize(nToThePower)

  // Assertions

  expect(memoizedNToThePower(2, 3)).toBe(8)
  expect(memoizedNToThePower(2, 3)).toBe(8)
})

test('inject custom cache', function () {
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
      return (key in this.cache)
    },
    get: function (key) {
      return this.cache[key]
    },
    set: function (key, value) {
      setMethodExecutionCount++
      this.cache[key] = value
    },
    delete: function (key) {
      delete this.cache[key]
    }
  }
  var customCache = {
    create: function () {
      var cache = Object.create(customCacheProto)
      cache.cache = Object.create(null)
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

  expect(hasMethodExecutionCount).toBe(2)
  expect(setMethodExecutionCount).toBe(1)
})

test('inject custom serializer', function () {
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

  expect(serializerMethodExecutionCount).toBe(2)
})

test('memoize circular JSON', function () {
  var circular = {
    a: 'foo'
  }
  circular.b = circular

  function circularFunction(a) {
    return a.a
  }

  var memoizedCircularFunction = memoize(circularFunction)

  // Assertions

  expect(memoizedCircularFunction(circular)).toBe("foo")
  expect(memoizedCircularFunction(circular)).toBe("foo")
})
