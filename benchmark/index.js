const debug = require('logdown')()
const iMemoized = require('iMemoized')
let Benchmark = require('benchmark')
let underscore = require('underscore').memoize
let lodash = require('lodash').memoize
let memoizee = require('memoizee')
let R = require('ramda')
const fastMemoize = require('../src/')

//
// Fibonacci suite
//

let fibonacci = (n) => {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}

let memoizedUnderscore = underscore(fibonacci)
let memoizedLodash = lodash(fibonacci)
let memoizedMemoizee = memoizee(fibonacci)
let memoizedRamda = R.memoize(fibonacci)
let memoizedImemoized = iMemoized.memoize(fibonacci)
const memoizedFastMemoizeCurrentVersion = fastMemoize(fibonacci)

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
  .add('ramda', () => {
    memoizedRamda(fibNumber)
  })
  .add('iMemoized', () => {
    memoizedImemoized(fibNumber)
  })
  .add(`fast-memoize@current`, () => {
    memoizedFastMemoizeCurrentVersion(fibNumber)
  })

suiteFibonnaci
  .on('cycle', (event) => {
    const currentRunning = String(event.target)
      .replace(/(.*) x/, (match, p1) => `*${p1}* x`)
    debug.log(currentRunning)
  })
  .on('complete', function () {
    debug.log()
    debug.log(`Fastest is *${this.filter('fastest').map('name')}*`)
  })
  .run({'async': true})
