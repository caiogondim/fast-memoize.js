const debug = require('logdown')()
let Benchmark = require('benchmark')
let underscore = require('underscore').memoize
let lodash = require('lodash').memoize
let memoizee = require('memoizee')
let addyOsmani = require('./addy-osmani')
let R = require('ramda')
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
let memoizedRamda = R.memoize(fibonacci)
const memoizedFastMemoizeCurrentVersion = fastMemoize(fibonacci)

let caches = []
caches.push(require('../src/cache/map'))
caches.push(require('../src/cache/object'))
caches.push(require('../src/cache/object-without-prototype'))
caches.push(require('./cache/isaacs-lru-cache'))

let serializers = []
serializers.push(require('../src/serializer/json-stringify'))

let strategies = []
strategies.push(require('../src/strategy/naive'))
strategies.push(require('../src/strategy/optimize-for-single-argument'))
strategies.push(require('../src/strategy/infer-arity'))

let memoizedFunctions = []
strategies.forEach(function (strategy) {
  serializers.forEach(function (serializer) {
    caches.forEach(function (cache) {
      memoizedFunctions.push(strategy(fibonacci, {cache, serializer}))
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
  .add('ramda', () => {
    memoizedRamda(fibNumber)
  })
  .add(`fast-memoize v${packageJSON.version}`, () => {
    memoizedFastMemoizeCurrentVersion(fibNumber)
  })

memoizedFunctions.forEach(function (memoizedFunction) {
  suiteFibonnaci.add(memoizedFunction._name, () => {
    memoizedFunction(fibNumber)
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
