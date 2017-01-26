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

let fibonacci = (n) => {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}

let caches = []
caches.push(require('./map'))
caches.push(require('./object'))
caches.push(require('./object-without-prototype'))
caches.push(require('./lru-cache'))

let serializers = []
serializers.push(require('../serializer/json-stringify'))

let strategies = []
strategies.push(require('../strategy/partial-application'))

let memoizedFunctions = []
strategies.forEach(function (strategy) {
  serializers.forEach(function (serializer) {
    caches.forEach(function (cache) {
      let memoizedFibonacci = strategy(fibonacci, {cache, serializer})
      memoizedFibonacci.label = cache.label
      memoizedFunctions.push(memoizedFibonacci)
    })
  })
})

let suiteFibonnaci = new Benchmark.Suite()
let fibNumber = 15

memoizedFunctions.forEach(function (memoizedFunction) {
  suiteFibonnaci.add(memoizedFunction.label, () => memoizedFunction(fibNumber))
})

suiteFibonnaci
  .on('cycle', onCycle)
  .on('complete', onComplete)
  .run({'async': true})
