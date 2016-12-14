const debug = require('logdown')()
const Benchmark = require('benchmark')
const fastMemoize = require('../src')

//
// Fibonacci suite
//

const fibonacci = (n) => {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}

const memoizedFastMemoizeCurrentVersion = fastMemoize(fibonacci)

const suiteFibonnaci = new Benchmark.Suite()
const fibNumber = 15

suiteFibonnaci
  .add(`fast-memoize@current`, () => {
    memoizedFastMemoizeCurrentVersion(fibNumber)
  })
  .on('cycle', (event) => {
    const currentRunning = String(event.target)
      .replace(/(.*) x/, (match, p1) => `\`${p1}\` x`)
    debug.log(currentRunning)
  })
  .run({'async': true})
