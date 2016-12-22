const ora = require('ora')
const logger = require('logdown')()
const Table = require('cli-table2')

const results = []

//
// Benchmark
//

const fibonacci = (n) => {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}

const fibNumber = 40
const maxIterations = [
  100000,
  1000000,
  10000000,
  100000000
]

// lodash

const lodash = require('lodash')
const memoizedByLodash = lodash.memoize(fibonacci)

maxIterations.forEach((maxIteration) => {
  let time = process.hrtime()
  for (let j = 0; j < maxIteration; j += 1) {
    memoizedByLodash(fibNumber)
  }
  let diff = process.hrtime(time)
  let diffInNanoSeconds = ((diff[0] * 1e9) + diff[1])

  ora(`lodash x${maxIteration}`).succeed()

  results.push({
    name: 'lodash',
    iterations: maxIteration,
    time: diffInNanoSeconds
  })
})

// underscore

const underscore = require('underscore')
const memoizedByUnderscore = underscore.memoize(fibonacci)

logger.log('')

maxIterations.forEach((maxIteration) => {
  let time = process.hrtime()
  for (let j = 0; j < maxIteration; j += 1) {
    memoizedByUnderscore(fibNumber)
  }
  let diff = process.hrtime(time)
  let diffInNanoSeconds = ((diff[0] * 1e9) + diff[1])

  ora(`underscore x${maxIteration}`).succeed()

  results.push({
    name: 'underscore',
    iterations: maxIteration,
    time: diffInNanoSeconds
  })
})

// iMemoized

const iMemoized = require('iMemoized')
const memoizedByImemoized = iMemoized.memoize(fibonacci)

logger.log('')

maxIterations.forEach((maxIteration) => {
  let time = process.hrtime()
  for (let j = 0; j < maxIteration; j += 1) {
    memoizedByImemoized(fibNumber)
  }
  let diff = process.hrtime(time)
  let diffInNanoSeconds = ((diff[0] * 1e9) + diff[1])

  ora(`iMemoized x${maxIteration}`).succeed()

  results.push({
    name: 'iMemoized',
    iterations: maxIteration,
    time: diffInNanoSeconds
  })
})

// Memoizee

const memoizee = require('memoizee')
const memoizedByMemoizee = memoizee(fibonacci)

logger.log('')

maxIterations.forEach((maxIteration) => {
  let time = process.hrtime()
  for (let j = 0; j < maxIteration; j += 1) {
    memoizedByMemoizee(fibNumber)
  }
  let diff = process.hrtime(time)
  let diffInNanoSeconds = ((diff[0] * 1e9) + diff[1])

  ora(`Memoizee x${maxIteration}`).succeed()

  results.push({
    name: 'Memoizee',
    iterations: maxIteration,
    time: diffInNanoSeconds
  })
})

// fast-memoize@current

const fastMemoize = require('../src')

const memoizedFastMemoizeCurrentVersion = fastMemoize(fibonacci)

logger.log('')

maxIterations.forEach((maxIteration) => {
  let time = process.hrtime()
  for (let i = 0; i < maxIteration; i += 1) {
    memoizedFastMemoizeCurrentVersion(fibNumber)
  }
  let diff = process.hrtime(time)
  let diffInNanoSeconds = ((diff[0] * 1e9) + diff[1])

  ora(`fast-memoize@current x${maxIteration}`).succeed()

  results.push({
    name: 'fast-memoize@current',
    iterations: maxIteration,
    time: diffInNanoSeconds
  })
})

//
// View
//

function showResults (results) {
  const table = new Table({head: ['NAME', 'ITERATIONS', 'TIME']})

  results.forEach((result) => {
    table.push([
      result.name,
      result.iterations,
      result.time.toLocaleString('en-US')
    ])
  })

  console.log('')
  console.log(table.toString())
}

showResults(results)
