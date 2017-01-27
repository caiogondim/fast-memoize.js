var memoize = require('../src')

var circular = {
  a: 'foo'
}
circular.b = circular

function circularFunction (a) {
  return a.a
}

var memoizedCircularFunction = memoize(circularFunction)

// Assertions
var one = memoizedCircularFunction(circular)
var two = memoizedCircularFunction(circular)
