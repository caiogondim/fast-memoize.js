// All runtime flags in:
// - https://github.com/v8/v8/blob/75128636f31636ab4695b9c75d986bcca654a1f5/src/runtime/runtime.h
// - https://github.com/thlorenz/v8-flags/blob/master/flags-0.11.md

// const v8 = require('v8')
// const logger = require('logdown')()
// const fastMemoize = require('../src')

// v8.setFlagsFromString('--allow_natives_syntax')
// v8.setFlagsFromString('--trace_gc')

// function fibonacci (n) {
//   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2)
// }

// function printOptimizationStatus (fn) {
//   switch(%GetOptimizationStatus(fn)) {
//     case 1: logger.log('Function is *optimized*'); break;
//     case 2: logger.log('Function is *not optimized*'); break;
//     case 3: logger.log('Function is *always optimized*'); break;
//     case 4: logger.log('Function is *never optimized*'); break;
//     case 6: logger.log('Function is *maybe deoptimized*'); break;
//   }
// }

// const fibonacciMemoized = fastMemoize(fibonacci)

// // console.log(VirtualMachine)
// fibonacciMemoized(30)
// %OptimizeFunctionOnNextCall(fibonacciMemoized)
// fibonacciMemoized(30)
// printOptimizationStatus(fibonacciMemoized)
