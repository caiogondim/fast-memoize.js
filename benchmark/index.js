const ora = require('ora')
const Table = require('cli-table2')
const debug = require('logdown')()
const lruMemoize = require('lru-memoize').default
const iMemoized = require('iMemoized')
const Benchmark = require('benchmark')
const underscore = require('underscore').memoize
const lodash = require('lodash').memoize
const memoizee = require('memoizee')
const R = require('ramda')
const nano = require('nano-memoize')
const fastMemoize = require('../src/')

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

const fibonacci = (n) => {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}

const fibNumber = 15
const fibCount = 1973

const memoizedUnderscore = underscore(fibonacci)
const memoizedLodash = lodash(fibonacci)
const memoizedMemoizee = memoizee(fibonacci)
const memoizedRamda = R.memoize(fibonacci)
const memoizedImemoized = iMemoized.memoize(fibonacci)
const memoizedLRUSingleCache = lruMemoize(fibonacci)
const memoizedLRUWithLimit = lruMemoize(fibCount)(fibonacci)
const memoizedNano = nano(fibonacci)
const memoizedFastMemoizeCurrentVersion = fastMemoize(fibonacci)

const benchmark = new Benchmark.Suite()

benchmark
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
  .add('lru-memoize (single cache)', () => {
    memoizedLRUSingleCache(fibNumber)
  })
  .add('lru-memoize (with limit)', () => {
    memoizedLRUWithLimit(fibNumber)
  })
  .add('nano-memoize', () => {
    memoizedNano(fibNumber)
  })
  .add(`fast-memoize@current`, () => {
    memoizedFastMemoizeCurrentVersion(fibNumber)
  })
  .on('cycle', onCycle)
  .on('complete', onComplete)
  .run({'async': true})
