/* global test, expect, jest */

const memoize = require('../src')

test('speed', () => {
  // Vanilla Fibonacci

  function vanillaFibonacci (n) {
    return n < 2 ? n : vanillaFibonacci(n - 1) + vanillaFibonacci(n - 2)
  }

  const vanillaExecTimeStart = Date.now()
  vanillaFibonacci(35)
  const vanillaExecTime = Date.now() - vanillaExecTimeStart

  // Memoized

  let fibonacci = n => n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)

  fibonacci = memoize(fibonacci)
  const memoizedFibonacci = fibonacci

  const memoizedExecTimeStart = Date.now()
  memoizedFibonacci(35)
  const memoizedExecTime = Date.now() - memoizedExecTimeStart

  // Assertion

  expect(memoizedExecTime < vanillaExecTime).toBe(true)
})

test('memoize functions with single primitive argument', () => {
  function plusPlus (number) {
    return number + 1
  }

  const memoizedPlusPlus = memoize(plusPlus)

  // Assertions

  expect(memoizedPlusPlus(1)).toBe(2)
  expect(memoizedPlusPlus(1)).toBe(2)
})

test('memoize functions with single non-primitive argument', () => {
  let numberOfCalls = 0
  function plusPlus (obj) {
    numberOfCalls += 1
    return obj.number + 1
  }

  const memoizedPlusPlus = memoize(plusPlus)

  // Assertions
  expect(memoizedPlusPlus({number: 1})).toBe(2)
  expect(numberOfCalls).toBe(1)
  expect(memoizedPlusPlus({number: 1})).toBe(2)
  expect(numberOfCalls).toBe(1)
})

test('memoize functions with N arguments', () => {
  function nToThePower (n, power) {
    return Math.pow(n, power)
  }

  const memoizedNToThePower = memoize(nToThePower)

  // Assertions

  expect(memoizedNToThePower(2, 3)).toBe(8)
  expect(memoizedNToThePower(2, 3)).toBe(8)
})

test('memoize functions with spread arguments', () => {
  function multiply (multiplier, ...theArgs) {
    return theArgs.map(function (element) {
      return multiplier * element
    })
  }

  const memoizedMultiply = memoize(multiply, {
    strategy: memoize.strategies.variadic
  })

  // Assertions

  expect(memoizedMultiply(2, 1, 2, 3)).toEqual([2, 4, 6])
  expect(memoizedMultiply(2, 4, 5, 6)).toEqual([8, 10, 12])
})

test('inject custom cache', () => {
  let hasMethodExecutionCount = 0
  let setMethodExecutionCount = 0

  // a custom cache instance must implement:
  // - has
  // - get
  // - set
  // - delete
  const customCacheProto = {
    has (key) {
      hasMethodExecutionCount++
      return (key in this.cache)
    },
    get (key) {
      return this.cache[key]
    },
    set (key, value) {
      setMethodExecutionCount++
      this.cache[key] = value
    },
    delete (key) {
      delete this.cache[key]
    }
  }
  const customCache = {
    create () {
      const cache = Object.create(customCacheProto)
      cache.cache = Object.create(null)
      return cache
    }
  }

  function minus (a, b) {
    return a - b
  }

  const memoizedMinus = memoize(minus, {
    cache: customCache
  })
  memoizedMinus(3, 1)
  memoizedMinus(3, 1)

  // Assertions

  expect(hasMethodExecutionCount).toBe(2)
  expect(setMethodExecutionCount).toBe(1)
})

test('inject custom serializer', () => {
  let serializerMethodExecutionCount = 0

  function serializer () {
    serializerMethodExecutionCount++
    return JSON.stringify(arguments)
  }

  function minus (a, b) {
    return a - b
  }

  const memoizedMinus = memoize(minus, {
    serializer
  })
  memoizedMinus(3, 1)
  memoizedMinus(3, 1)

  // Assertions

  expect(serializerMethodExecutionCount).toBe(2)
})

test('explicitly use exposed monadic strategy', () => {
  let numberOfCalls = 0
  function plusPlus (number) {
    numberOfCalls += 1
    return number + 1
  }
  const spy = jest.spyOn(memoize.strategies, 'monadic')
  const memoizedPlusPlus = memoize(plusPlus, { strategy: memoize.strategies.monadic })

  // Assertions
  expect(memoizedPlusPlus(1)).toBe(2)
  expect(numberOfCalls).toBe(1)
  expect(memoizedPlusPlus(1)).toBe(2)
  expect(numberOfCalls).toBe(1)
  expect(spy).toHaveBeenCalled()

  // Teardown
  spy.mockRestore()
})

test('explicitly use exposed variadic strategy', () => {
  let numberOfCalls = 0
  function plusPlus (number) {
    numberOfCalls += 1
    return number + 1
  }
  const spy = jest.spyOn(memoize.strategies, 'variadic')
  const memoizedPlusPlus = memoize(plusPlus, { strategy: memoize.strategies.variadic })

  // Assertions
  expect(memoizedPlusPlus(1)).toBe(2)
  expect(numberOfCalls).toBe(1)
  expect(memoizedPlusPlus(1)).toBe(2)
  expect(numberOfCalls).toBe(1)
  expect(spy).toHaveBeenCalled()

  // Teardown
  spy.mockRestore()
})
