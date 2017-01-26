const ora = require('ora')
const logger = require('logdown')()
const Table = require('cli-table2')

const results = []

//
// Benchmark
//

function fibonacci1 (n) {
  return n < 2 ? n : fibonacci1(n - 1) + fibonacci1(n - 2)
}

function fibonacci2 (n) {
  return n < 2 ? n : fibonacci2(n - 1) + fibonacci2(n - 2)
}

function range (begin, end) {
  var array = []
  for (let i = begin; i <= end; i++) {
    array.push(i)
  }

  return array
}

const fibonacciNumbers = range(10, 30)

//
// Recursive memoization
//

const fastMemoize = require('../src')

// eslint-disable-next-line no-func-assign
fibonacci1 = fastMemoize(fibonacci1)

const spinner1 = ora(`optimizing fibonacci1`).start()
for (let i = 0; i < 1000000; i++) {
  fibonacci1(10)
}
spinner1.stop()

logger.log('')

fibonacciNumbers.forEach((n) => {
  let time = process.hrtime()
  fibonacci1(n)
  let diff = process.hrtime(time)
  let diffInNanoSeconds = ((diff[0] * 1e9) + diff[1])

  ora(`recursive memoization x${n}`).succeed()

  results.push({
    name: 'recursive',
    fibonacciOf: n,
    time: diffInNanoSeconds
  })
})

// Vanilla memoization

const memoizedFibonacci2 = fastMemoize(fibonacci2)

const spinner2 = ora(`optimizing fibonacci2`).start()
for (let i = 0; i < 1000000; i++) {
  fibonacci2(10)
}
spinner2.stop()

logger.log('')

fibonacciNumbers.forEach((n) => {
  let time = process.hrtime()
  memoizedFibonacci2(n)
  let diff = process.hrtime(time)
  let diffInNanoSeconds = ((diff[0] * 1e9) + diff[1])

  ora(`vanilla memoization x${n}`).succeed()

  results.push({
    name: 'vanilla',
    fibonacciOf: n,
    time: diffInNanoSeconds
  })
})

//
// View
//

function showResults (results) {
  const table = new Table({head: ['NAME', 'FIBONACCI OF', 'TIME TO COMPLETE (IN NANOSECONDS)']})

  results.forEach((result) => {
    table.push([
      result.name,
      result.fibonacciOf,
      result.time.toLocaleString('en-US')
    ])
  })

  console.log('')
  console.log(table.toString())
}

showResults(results)
