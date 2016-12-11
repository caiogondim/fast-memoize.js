// To run code inside devtools:
//    node --inspect --debug-brk file-name.js
// To get optimizations and deoptimizations feeedback:
//    node --trace-deopt --trace-opt --runtime_call_stats --trace_ic --trace-inling

const logger = require('logdown')()

const fibonacci = (n) => {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}

const fibNumber = 40
const iterationsNumbers = [
  100000,
  1000000,
  10000000,
  100000000
]

//
// lodash
//

const lodash = require('lodash')
const memoizedByLodash = lodash.memoize(fibonacci)

logger.log('')
logger.log('*lodash*')

iterationsNumbers.forEach((iterationsNumber) => {
  console.time(`x${iterationsNumber}`)
  for (let j = 0; j < iterationsNumber; j += 1) {
    memoizedByLodash(fibNumber)
  }
  console.timeEnd(`x${iterationsNumber}`)
})

//
// underscore
//

let underscore = require('underscore')
const memoizedByUnderscore = underscore.memoize(fibonacci)

logger.log('')
logger.log('*underscore*')

iterationsNumbers.forEach((iterationsNumber) => {
  console.time(`x${iterationsNumber}`)
  for (let j = 0; j < iterationsNumber; j += 1) {
    memoizedByUnderscore(fibNumber)
  }
  console.timeEnd(`x${iterationsNumber}`)
})

//
// iMemoized
//

const iMemoized = require('iMemoized')
const memoizedByImemoized = iMemoized.memoize(fibonacci)

logger.log('')
logger.log('*iMemoized*')

iterationsNumbers.forEach((iterationsNumber) => {
  console.time(`x${iterationsNumber}`)
  for (let j = 0; j < iterationsNumber; j += 1) {
    memoizedByImemoized(fibNumber)
  }
  console.timeEnd(`x${iterationsNumber}`)
})

//
// Memoizee
//

let memoizee = require('memoizee')
const memoizedByMemoizee = memoizee(fibonacci)

logger.log('')
logger.log('*Memoizee*')

iterationsNumbers.forEach((iterationsNumber) => {
  console.time(`x${iterationsNumber}`)
  for (let j = 0; j < iterationsNumber; j += 1) {
    memoizedByMemoizee(fibNumber)
  }
  console.timeEnd(`x${iterationsNumber}`)
})

//
// Current implementation
//

const fastMemoize = require('../src')

const memoizedFastMemoizeCurrentVersion = fastMemoize(fibonacci)

logger.log('')
logger.log('*fast-memoize*')

iterationsNumbers.forEach((iterationsNumber) => {
  console.time(`x${iterationsNumber}`)
  for (let i = 0; i < iterationsNumber; i += 1) {
    memoizedFastMemoizeCurrentVersion(fibNumber)
  }
  console.timeEnd(`x${iterationsNumber}`)
})
