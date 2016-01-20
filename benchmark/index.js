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

let resolvers = []
resolvers.push(require('./resolver/json-stringify'))

let memoizers = []
memoizers.push(require('./memoizer/index'))
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
let args = [5]
suiteFibonnaci
  .add('vanilla', () => {
    fibonacci(5)
  })
  .add('algorithm1', () => {
    memoized1(5)
  })
  .add('algorithm2', () => {
    memoized2(5)
  })
  .add('algorithm3', () => {
    memoized3(5)
  })
  .add('underscore', () => {
    memoizedUnderscore(5)
  })
  .add('lodash', () => {
    memoizedLodash(5)
  })
  .add('memoizee', () => {
    memoizedMemoizee(5)
  })
  .add('addy-osmani', () => {
    memoizedAddyOsmani(5)
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
