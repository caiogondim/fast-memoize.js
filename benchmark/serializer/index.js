import ora from 'ora'
import Table from 'cli-table2'
import logdown from 'logdown'
import Benchmark from 'benchmark'
import objectCache from '../cache/object.js'
import stringifySerializer from './json-stringify.js'
import stringifyBindedSerializer from './json-stringify-binded.js'
import utilInspectSerializer from './util-inspect.js'
import partialApplicationStrategy from '../strategy/partial-application.js'

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
caches.push(objectCache)

const serializers = []
serializers.push(stringifySerializer)
serializers.push(stringifyBindedSerializer)
serializers.push(utilInspectSerializer)

const strategies = []
strategies.push(partialApplicationStrategy)

const memoizedFunctions = []
strategies.forEach((strategy) => {
  serializers.forEach((serializer) => {
    caches.forEach((cache) => {
      const memoizedFibonacci = strategy(fibonacci, { cache, serializer })
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
  .run({ async: true })
