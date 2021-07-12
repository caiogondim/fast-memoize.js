import ora from 'ora'
import logdown from 'logdown'
import Table from 'cli-table2'
import Benchmark from 'benchmark'
import mapCache from './map.js'
import objectCache from './object.js'
import objectWithoutProtoCache from './object-without-prototype.js'
import lruCache from './lru-cache.js'
import stringifySerializer from '../serializer/json-stringify.js'
import partialApplicationStrategy from '../strategy/partial-application.js'
import stringifyBindedSerializer from '../serializer/json-stringify-binded.js'
import utilInspectSerializer from '../serializer/util-inspect.js'
import naiveStrategy from '../strategy/naive.js'
import singleArgumentStrategy from './strategy/optimize-for-single-argument.js'
import inferArityStrategy from './strategy/infer-arity.js'

const debug = logdown()

const results = []

//
// View
//

function showResults (results) {
  const table = new Table({ head: ['NAME', 'OPS/SEC', 'RELATIVE MARGIN OF ERROR', 'SAMPLE SIZE'] })
  results.forEach((result) => {
    table.push([
      result.target.name,
      result.target.hz.toLocaleString('en-US', { maximumFractionDigits: 0 }),
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

  const orderedResults = sortDescResults(results)
  showResults(results)

  debug.log()
  debug.log(`Fastest is *${orderedResults[0].target.name}*`)
}

function sortDescResults (results) {
  return results.sort((a, b) => a.target.hz < b.target.hz ? 1 : -1)
}

const spinner = ora('Running benchmark')

//
// Fibonacci suite
//

const fibonacci = (n) => {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}

const caches = []
caches.push(mapCache)
caches.push(objectCache)
caches.push(objectWithoutProtoCache)
caches.push(lruCache)

const serializers = []
serializers.push(stringifySerializer)
serializers.push(stringifyBindedSerializer)
serializers.push(utilInspectSerializer)

const strategies = []
strategies.push(naiveStrategy)
strategies.push(singleArgumentStrategy)
strategies.push(inferArityStrategy)
strategies.push(partialApplicationStrategy)

const memoizedFunctions = []
strategies.forEach(function (strategy) {
  serializers.forEach(function (serializer) {
    caches.forEach(function (cache) {
      memoizedFunctions.push(strategy(fibonacci, { cache, serializer }))
    })
  })
})

const suiteFibonnaci = new Benchmark.Suite()
const fibNumber = 15

memoizedFunctions.forEach(function (memoizedFunction) {
  suiteFibonnaci.add(memoizedFunction.label, () => {
    memoizedFunction(fibNumber)
  })
})

suiteFibonnaci
  .on('cycle', (event) => {
    results.push(event)
    onCycle(event)
  })
  .on('complete', onComplete)
  .run({ async: true })

spinner.start()
