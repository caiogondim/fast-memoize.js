'use strict'

let Benchmark = require('benchmark')
let memoize1 = require('./1')
let underscore = require('underscore').memoize
let lodash = require('lodash').memoize
let memoizee = require('memoizee')

//
// Fibonacci suite
//

let fibonacci = (n) => {
  return n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2)
}

let memoized1 = memoize1(fibonacci)
let memoizedUnderscore = underscore(fibonacci)
let memoizedLodash = lodash(fibonacci)
let memoizedMemoizee = memoizee(fibonacci)

let suiteFibonnaci = new Benchmark.Suite()

suiteFibonnaci
  .add('vanilla', () => {
    fibonacci(15)
  })
  .add('algorithm1', () => {
    memoized1(15)
  })
  .add('underscore', () => {
    memoizedUnderscore(15)
  })
  .add('lodash', () => {
    memoizedLodash(15)
  })
  .add('memoizee', () => {
    memoizedMemoizee(15)
  })
  .on('cycle', (event) => {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({'async': true})
