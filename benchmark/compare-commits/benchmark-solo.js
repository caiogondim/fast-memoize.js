import Benchmark from 'benchmark'
import { memoize } from '../../src/index.js'

const benchmarkResults = []

//
// View
//

function showResults (benchmarkResults) {
  const output = {
    operationsPerSecond: benchmarkResults[0].target.hz,
    relativeMarginOfError: benchmarkResults[0].target.stats.rme,
    sampleSize: benchmarkResults[0].target.stats.sample.length
  }

  console.log(JSON.stringify(output))
}

function onComplete () {
  showResults(benchmarkResults)
}

//
// Benchmark
//

const fibonacci = (n) => {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}

const memoizedFastMemoizeCurrentVersion = memoize(fibonacci)

const benchmark = new Benchmark.Suite()
const fibNumber = 15

benchmark
  .add('fast-memoize@current', () => {
    memoizedFastMemoizeCurrentVersion(fibNumber)
  })
  .on('cycle', (event) => {
    benchmarkResults.push(event)
  })
  .on('complete', onComplete)
  .run({ async: true })
