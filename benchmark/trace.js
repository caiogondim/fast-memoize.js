// to run code inside devtools:
//    node --inspect --debug-brk file-name.js
// to get optimizations and deoptimizations feeedback:
//    node --trace-deopt --trace-opt --runtime_call_stats --trace_ic --trace_ic --turbo

const fibonacci = (n) => n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)

const fibNumber = 40
const fastMemoize = require('../src')
const memoizedFibonacci = fastMemoize(fibonacci)

memoizedFibonacci(fibNumber)
