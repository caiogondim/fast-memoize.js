const ora = require('ora')
const Table = require('cli-table2')
const debug = require('logdown')()

const Benchmark = require('benchmark')
const fastMemoize = require('../src/')
const iMemoized = require('iMemoized')
const lodash = require('lodash').memoize
const memoizee = require('memoizee')
const R = require('ramda')
const underscore = require('underscore').memoize

const results = []
const spinner = ora('Running benchmark')

//
// View
//

function showResults (benchmarkResults) {
  const table = new Table({head: ['NAME', 'OPS/SEC', 'RELATIVE MARGIN OF ERROR', 'SAMPLE SIZE']})
  benchmarkResults.forEach((result) => {
    table.push([
      result.target.name,
      result.target.hz.toLocaleString('en-US', {maximumFractionDigits: 0}),
      `± ${result.target.stats.rme.toFixed(2)}%`,
      result.target.stats.sample.length
    ])
  })

  console.log(table.toString())
}

function sortDescResults (benchmarkResults) {
  return benchmarkResults.sort((a, b) => a.target.hz < b.target.hz ? 1 : -1)
}

function onCycle (event) {
  results.push(event)
  ora(event.target.name).succeed()
}

function onComplete () {
  spinner.stop()
  debug.log()

  const orderedBenchmarkResults = sortDescResults(results)
  showResults(orderedBenchmarkResults)
}

spinner.start()

//
// Benchmark
//

const benchmark = new Benchmark.Suite()
const fibNumber = 10

benchmark
  .add('vanilla', () => {
    const fibonacci = (n) => {
      return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
    }

    fibonacci(fibNumber)
    fibonacci(fibNumber + 10)
    fibonacci(fibNumber + 20)
    fibonacci(fibNumber + 30)
  })
  .add('underscore', () => {
    const memoizedUnderscore = underscore((n) => {
      return n < 2 ? n : memoizedUnderscore(n - 1) + memoizedUnderscore(n - 2)
    })

    memoizedUnderscore(fibNumber)
    memoizedUnderscore(fibNumber + 10)
    memoizedUnderscore(fibNumber + 20)
    memoizedUnderscore(fibNumber + 30)
  })
  .add('lodash', () => {
    const memoizedLodash = lodash((n) => {
      return n < 2 ? n : memoizedLodash(n - 1) + memoizedLodash(n - 2)
    })

    memoizedLodash(fibNumber)
    memoizedLodash(fibNumber + 10)
    memoizedLodash(fibNumber + 20)
    memoizedLodash(fibNumber + 30)
  })
  .add('memoizee', () => {
    const memoizedMemoizee = memoizee((n) => {
      return n < 2 ? n : memoizedMemoizee(n - 1) + memoizedMemoizee(n - 2)
    })

    memoizedMemoizee(fibNumber)
    memoizedMemoizee(fibNumber + 10)
    memoizedMemoizee(fibNumber + 20)
    memoizedMemoizee(fibNumber + 30)
  })
  .add('ramda', () => {
    const memoizedRamda = R.memoize((n) => {
      return n < 2 ? n : memoizedRamda(n - 1) + memoizedRamda(n - 2)
    })

    memoizedRamda(fibNumber)
    memoizedRamda(fibNumber + 10)
    memoizedRamda(fibNumber + 20)
    memoizedRamda(fibNumber + 30)
  })
  .add('iMemoized', () => {
    const memoizedImemoized = iMemoized.memoize((n) => {
      return n < 2 ? n : memoizedImemoized(n - 1) + memoizedImemoized(n - 2)
    })

    memoizedImemoized(fibNumber)
    memoizedImemoized(fibNumber + 10)
    memoizedImemoized(fibNumber + 20)
    memoizedImemoized(fibNumber + 30)
  })
  .add(`fast-memoize@current`, () => {
    const memoizedFastMemoizeCurrentVersion = fastMemoize((n) => {
      return n < 2 ? n : memoizedFastMemoizeCurrentVersion(n - 1) + memoizedFastMemoizeCurrentVersion(n - 2)
    })

    memoizedFastMemoizeCurrentVersion(fibNumber)
    memoizedFastMemoizeCurrentVersion(fibNumber + 10)
    memoizedFastMemoizeCurrentVersion(fibNumber + 20)
    memoizedFastMemoizeCurrentVersion(fibNumber + 30)
  })
  .on('cycle', onCycle)
  .on('complete', onComplete)
  .run({'async': true})
