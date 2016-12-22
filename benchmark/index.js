const ora = require('ora')
const Table = require('cli-table2')
const debug = require('logdown')()
const iMemoized = require('iMemoized')
const Benchmark = require('benchmark')
const underscore = require('underscore').memoize
const lodash = require('lodash').memoize
const memoizee = require('memoizee')
const R = require('ramda')
const fastMemoize = require('../src/')

const results = []

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

function onCycle (event) {
  ora(event.target.name).succeed()
}

function onComplete () {
  spinner.stop()
  debug.log()

  const orderedBenchmarkResults = sortDescResults(results)
  showResults(orderedBenchmarkResults)

  debug.log()
  debug.log(`Fastest is *${orderedBenchmarkResults[0].target.name}*`)
}

function sortDescResults (benchmarkResults) {
  return benchmarkResults.sort((a, b) => a.target.hz < b.target.hz ? 1 : -1)
}

const spinner = ora('Running benchmark')

//
// Benchmark
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

let benchmark = new Benchmark.Suite()
let fibNumber = 15

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
  .add(`fast-memoize@current`, () => {
    memoizedFastMemoizeCurrentVersion(fibNumber)
  })
  .on('cycle', (event) => {
    results.push(event)
    onCycle(event)
  })
  .on('complete', onComplete)
  .run({'async': true})

spinner.start()
