'use strict'

const debug = require('logdown')()
let Benchmark = require('benchmark')
let underscore = require('underscore').memoize
let lodash = require('lodash').memoize
let memoizee = require('memoizee')
let addyOsmani = require('./addy-osmani')
const fastMemoize = require('../src/')
const packageJSON = require('../package.json')

//
// Fibonacci suite
//

let fibonacci = (n) => {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}

let memoizedUnderscore = underscore(fibonacci)
let memoizedLodash = lodash(fibonacci)
let memoizedMemoizee = memoizee(fibonacci)
let memoizedAddyOsmani = addyOsmani(fibonacci)
const memoizedFastMemoizeCurrentVersion = fastMemoize(fibonacci)

let caches = []
caches.push(require('./cache/map'))
caches.push(require('./cache/object'))
caches.push(require('./cache/isaacs-lru-cache'))

let serializers = []
serializers.push(require('./serializer/json-stringify'))

let strategies = []
strategies.push(require('./strategy/naive'))
strategies.push(require('./strategy/optimize-for-single-argument'))

let memoizedFunctions = []
strategies.forEach(function (strategy) {
  serializers.forEach(function (resolver) {
    caches.forEach(function (cache) {
      memoizedFunctions.push(strategy(fibonacci, cache, resolver))
    })
  })
})

let suiteFibonnaci = new Benchmark.Suite()
let fibNumber = 15

suiteFibonnaci
  .add('vanilla', () => {
    fibonacci(fibNumber)
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
  .add(`fast-memoize v${packageJSON.version}`, () => {
    memoizedFastMemoizeCurrentVersion(fibNumber)
  })

memoizedFunctions.forEach(function (memoizedFunction) {
  suiteFibonnaci.add(memoizedFunction._name, () => {
    memoizedFunction(5)
  })
})

suiteFibonnaci
  .on('cycle', (event) => {
    const currentRunning = String(event.target)
      .replace(/(.*)\ x/, (match, p1) => `\`${p1}\` x`)
    debug.log(currentRunning)
  })
  .on('complete', function () {
    debug.log()
    debug.log(`Fastest is \`${this.filter('fastest').map('name')}\``)
  })
  .run({'async': true})
