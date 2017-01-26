const ora = require('ora')
const Table = require('cli-table2')
const Benchmark = require('benchmark')
const fastMemoize = require('../src')

const benchmarkResults = []

//
// View
//

const spinner = ora('Running benchmark')

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

function onComplete () {
  spinner.stop()

  showResults(benchmarkResults)
}

//
// Benchmark
//

const fibonacci = (n) => {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}

const memoizedFastMemoizeCurrentVersion = fastMemoize(fibonacci)

const benchmark = new Benchmark.Suite()
const fibNumber = 15

benchmark
  .add(`fast-memoize@current`, () => {
    memoizedFastMemoizeCurrentVersion(fibNumber)
  })
  .on('cycle', (event) => {
    benchmarkResults.push(event)
  })
  .on('complete', onComplete)
  .run({'async': true})

spinner.start()
