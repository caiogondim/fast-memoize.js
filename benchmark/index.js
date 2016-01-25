'use strict'

let Benchmark = require('benchmark')
let memoize1 = require('./1')
let memoize2 = require('./2')
let memoize3 = require('./3')
let underscore = require('underscore').memoize
let lodash = require('lodash').memoize
let memoizee = require('memoizee')
let addyOsmani = require('./addy-osmani')

//
// Fibonacci suite
//

let fibonacci = (n) => {
  return n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2)
}

let memoized1 = memoize1(fibonacci)
let memoized2 = memoize2(fibonacci)
let memoized3 = memoize3(fibonacci)
let memoizedUnderscore = underscore(fibonacci)
let memoizedLodash = lodash(fibonacci)
let memoizedMemoizee = memoizee(fibonacci)
let memoizedAddyOsmani = addyOsmani(fibonacci)

let caches = []
caches.push(require('./cache/map'))
caches.push(require('./cache/object'))
caches.push(require('./cache/isaacs-lru-cache'))

let resolvers = []
resolvers.push(require('./resolver/json-stringify'))

let memoizers = []
memoizers.push(require('./memoizer/naive'))
memoizers.push(require('./memoizer/optimize-for-single-argument'))

let memoizedFunctions = []
memoizers.forEach(function(memoizer) {
  resolvers.forEach(function(resolver) {
    caches.forEach(function(cache) {
      memoizedFunctions.push(memoizer(fibonacci, cache, resolver))
    })
  })
})

let suiteFibonnaci = new Benchmark.Suite()
let fibNumber = 15

suiteFibonnaci
  .add('vanilla', () => {
    fibonacci(fibNumber)
  })
  .add('algorithm1', () => {
    memoized1(fibNumber)
  })
  .add('algorithm2', () => {
    memoized2(fibNumber)
  })
  .add('algorithm3', () => {
    memoized3(fibNumber)
  })
  .add('underscore', () => {
    memoizedUnderscore(fibNumber)
  })
  .add('lodash', () => {
    memoizedLodash(fibNumber)
  })
  .add('memoizee', () => {
    memoizedMemoizee(fibNumber)
  })
  .add('addy-osmani', () => {
    memoizedAddyOsmani(fibNumber)
  })

memoizedFunctions.forEach(function(memoizedFunction) {
  suiteFibonnaci.add(memoizedFunction._name, () => {
    memoizedFunction(5)
  })
})

suiteFibonnaci
  .on('cycle', (event) => {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({'async': true})
