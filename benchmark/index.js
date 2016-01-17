'use strict'

let Benchmark = require('benchmark')
let algorithm1 = require('./1')

//
let factorial = (num) => {
  if (num > 1) {
    return num * factorial(num - 1)
  } else {
    return 1
  }
}

let suite = new Benchmark.Suite()

suite
  .add('vanilla', () => {
    factorial(50)
  })
  .add('algorithm1', () => {
    let memoized = algorithm1(factorial)
    memoized(50)
  })
  .on('cycle', (event) => {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({'async': true})
