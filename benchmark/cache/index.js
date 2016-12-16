const debug = require('logdown')()
let Benchmark = require('benchmark')

//
// Fibonacci suite
//

let fibonacci = (n) => {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}

let caches = []
caches.push(require('./map'))
caches.push(require('./object'))
caches.push(require('./object-without-prototype'))
caches.push(require('./lru-cache'))

let serializers = []
serializers.push(require('../serializer/json-stringify'))

let strategies = []
strategies.push(require('../strategy/partial-application'))

let memoizedFunctions = []
strategies.forEach(function (strategy) {
  serializers.forEach(function (serializer) {
    caches.forEach(function (cache) {
      let memoizedFibonacci = strategy(fibonacci, {cache, serializer})
      memoizedFibonacci.label = cache.label
      memoizedFunctions.push(memoizedFibonacci)
    })
  })
})

let suiteFibonnaci = new Benchmark.Suite()
let fibNumber = 15

memoizedFunctions.forEach(function (memoizedFunction) {
  suiteFibonnaci.add(memoizedFunction.label, () => {
    memoizedFunction(fibNumber)
  })
})

suiteFibonnaci
  .on('cycle', (event) => {
    const currentRunning = String(event.target)
      .replace(/(.*) x/, (match, p1) => `*${p1}* x`)
    debug.log(currentRunning)
  })
  .on('complete', function () {
    debug.log()
    debug.log(`Fastest is *${this.filter('fastest').map('name')}*`)
  })
  .run({'async': true})
