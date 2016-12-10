// To run code inside devtools:
//    node --inspect --debug-brk file-name.js
// To get optimizations and deoptimizations feeedback:
//    node --trace-deopt --trace-opt

const logger = require('logdown')()

const fibonacci1 = (n) => {
  return n < 2 ? n : fibonacci1(n - 1) + fibonacci1(n - 2)
}
const fibonacci2 = (n) => {
  return n < 2 ? n : fibonacci2(n - 1) + fibonacci2(n - 2)
}
const fibNumber = 40
const iterationsNumber = 10000000

//
// Naive strategy
//

const cacheObjectWithoutPrototype = require('./cache/object-without-prototype')
const serializer = require('./serializer/json-stringify')
const strategy = require('./strategy/naive')

const memoizedCustom = strategy(fibonacci2, {
  cache: cacheObjectWithoutPrototype,
  serializer: serializer
})

logger.log('')
logger.log('*Naive strategy*')

console.time('naive-strategy')
for (let i = 0; i < iterationsNumber; i += 1) {
  memoizedCustom(fibNumber)
}
console.timeEnd('naive-strategy')

//
// Current implementation
//

const fastMemoize = require('../src')

const memoizedFastMemoizeCurrentVersion = fastMemoize(fibonacci1)

logger.log('')
logger.log('*Current implementation*')

console.time('current-implementation')
for (let i = 0; i < iterationsNumber; i += 1) {
  memoizedFastMemoizeCurrentVersion(fibNumber)
}
console.timeEnd('current-implementation')
