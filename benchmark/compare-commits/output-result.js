const Table = require('cli-table2')

const formatResult = (result) => {
  return {
    operationsPerSecond: result.operationsPerSecond.toLocaleString('en-US', {maximumFractionDigits: 0}),
    relativeMarginOfError: `± ${Number(result.relativeMarginOfError).toFixed(2)}%`,
    sampleSize: result.sampleSize
  }
}

const result1 = formatResult(JSON.parse(process.argv[2])) // current
const result2 = formatResult(JSON.parse(process.argv[3]))
const commit = process.argv[4]

const table = new Table({head: ['GIT', 'OPS/SEC', 'RELATIVE MARGIN OF ERROR', 'SAMPLE SIZE']})
table.push([
  'HEAD',
  result1.operationsPerSecond,
  result1.relativeMarginOfError,
  result1.sampleSize
])
table.push([
  `${commit}`,
  result2.operationsPerSecond,
  result2.relativeMarginOfError,
  result2.sampleSize
])

console.log(table.toString())
