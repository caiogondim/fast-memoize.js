import ora from 'ora'
import Table from 'cli-table2'
import logdown from 'logdown'
import Benchmark from 'benchmark'
import objectCache from '../cache/object.js'
import stringifySerializer from '../serializer/json-stringify.js'
import naiveStrategy from './naive.js'
import singleArgumentStrategy from './optimize-for-single-argument.js'
import inferArityStrategy from './infer-arity.js'
import partialApplicationStrategy from './partial-application.js'

const debug = logdown()
const results = []
const spinner = ora('Running benchmark')

//
// View
//

function showResults (benchmarkResults) {
  const table = new Table({ head: ['NAME', 'OPS/SEC', 'RELATIVE MARGIN OF ERROR', 'SAMPLE SIZE'] })
  benchmarkResults.forEach((result) => {
    table.push([
      result.target.name,
      result.target.hz.toLocaleString('en-US', { maximumFractionDigits: 0 }),
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

const caches = []
caches.push(objectCache)

const serializers = []
serializers.push(stringifySerializer)

const strategies = []
strategies.push(naiveStrategy)
strategies.push(singleArgumentStrategy)
strategies.push(inferArityStrategy)
strategies.push(partialApplicationStrategy)

const memoizedFunctions = []
strategies.forEach((strategy) => {
  serializers.forEach((serializer) => {
    caches.forEach((cache, index) => {
      // eslint-disable-next-line no-eval
      const memoizedFibonacci = strategy(eval(`fibonacci${index + 1}`), { cache, serializer })
      memoizedFibonacci.label = strategy.label
      memoizedFunctions.push(memoizedFibonacci)
    })
  })
})

const suiteFibonnaci = new Benchmark.Suite()

memoizedFunctions.forEach((memoizedFunction) => {
  suiteFibonnaci.add(memoizedFunction.label, () => memoizedFunction(20))
})

suiteFibonnaci
  .on('cycle', onCycle)
  .on('complete', onComplete)
  .run({ async: true })
