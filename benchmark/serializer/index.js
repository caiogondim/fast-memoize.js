const ora = require('ora')
const Table = require('cli-table2')
const debug = require('logdown')()
const Benchmark = require('benchmark')

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

  debug.log(table.toString())
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

const caches = []
caches.push(require('../cache/object'))

const serializers = []
serializers.push(require('./json-stringify'))
serializers.push(require('./json-stringify-binded'))
serializers.push(require('./util-inspect'))

const strategies = []
strategies.push(require('../strategy/partial-application'))

const memoizedFunctions = []
strategies.forEach((strategy) => {
  serializers.forEach((serializer) => {
    caches.forEach((cache) => {
      const memoizedFibonacci = strategy(fibonacci, {cache, serializer})
      memoizedFibonacci.label = serializer.label
      memoizedFunctions.push(memoizedFibonacci)
    })
  })
})

const suiteFibonnaci = new Benchmark.Suite()
const fibNumber = 20

memoizedFunctions.forEach((memoizedFunction) => {
  suiteFibonnaci.add(memoizedFunction.label, () => memoizedFunction(fibNumber))
})

suiteFibonnaci
  .on('cycle', onCycle)
  .on('complete', onComplete)
  .run({'async': true})
