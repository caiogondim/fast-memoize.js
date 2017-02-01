const ora = require('ora')
const debug = require('logdown')()
const Table = require('cli-table2')
const Benchmark = require('benchmark')

const results = []

//
// View
//

function showResults (results) {
  const table = new Table({head: ['NAME', 'OPS/SEC', 'RELATIVE MARGIN OF ERROR', 'SAMPLE SIZE']})
  results.forEach((result) => {
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
caches.push(require('./cache/map'))
caches.push(require('./cache/object'))
caches.push(require('./cache/object-without-prototype'))
caches.push(require('./cache/lru-cache'))

const serializers = []
serializers.push(require('./serializer/json-stringify'))
serializers.push(require('./serializer/json-stringify-binded'))
serializers.push(require('./serializer/util-inspect'))

const strategies = []
strategies.push(require('./strategy/naive'))
strategies.push(require('./strategy/optimize-for-single-argument'))
strategies.push(require('./strategy/infer-arity'))
strategies.push(require('./strategy/partial-application'))

const memoizedFunctions = []
strategies.forEach(function (strategy) {
  serializers.forEach(function (serializer) {
    caches.forEach(function (cache) {
      memoizedFunctions.push(strategy(fibonacci, {cache, serializer}))
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
  .run({'async': true})

spinner.start()
