const ora = require('ora')
const Table = require('cli-table2')
const debug = require('logdown')()
let Benchmark = require('benchmark')

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

// Creating multiple fibonacci functions to avoid a scenario where a benchmark could start with an
// optimized function by V8.

// eslint-disable-next-line no-unused-vars
function fibonacci1 (n) {
  return n < 2 ? n : fibonacci1(n - 1) + fibonacci1(n - 2)
}

// eslint-disable-next-line no-unused-vars
function fibonacci2 (n) {
  return n < 2 ? n : fibonacci2(n - 1) + fibonacci2(n - 2)
}

// eslint-disable-next-line no-unused-vars
function fibonacci3 (n) {
  return n < 2 ? n : fibonacci3(n - 1) + fibonacci3(n - 2)
}

// eslint-disable-next-line no-unused-vars
function fibonacci4 (n) {
  return n < 2 ? n : fibonacci4(n - 1) + fibonacci4(n - 2)
}

// eslint-disable-next-line no-unused-vars
function fibonacci5 (n) {
  return n < 2 ? n : fibonacci5(n - 1) + fibonacci5(n - 2)
}

let caches = []
caches.push(require('../cache/object'))

let serializers = []
serializers.push(require('../serializer/json-stringify'))

let strategies = []
strategies.push(require('./naive'))
strategies.push(require('./optimize-for-single-argument'))
strategies.push(require('./infer-arity'))
strategies.push(require('./partial-application'))

let memoizedFunctions = []
strategies.forEach((strategy) => {
  serializers.forEach((serializer) => {
    caches.forEach((cache, index) => {
      // eslint-disable-next-line no-eval
      let memoizedFibonacci = strategy(eval(`fibonacci${index + 1}`), {cache, serializer})
      memoizedFibonacci.label = strategy.label
      memoizedFunctions.push(memoizedFibonacci)
    })
  })
})

let suiteFibonnaci = new Benchmark.Suite()

memoizedFunctions.forEach((memoizedFunction) => {
  suiteFibonnaci.add(memoizedFunction.label, () => memoizedFunction(20))
})

suiteFibonnaci
  .on('cycle', onCycle)
  .on('complete', onComplete)
  .run({'async': true})
