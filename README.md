<img src="http://rawgit.com/caiogondim/fast-memoize/master/img/icon.svg" width="100%" />

# fast-memoize

<div>
  <img src="http://travis-ci.org/caiogondim/fast-memoize.js.svg?branch=master" alt="Travis CI"> <img src="http://img.badgesize.io/caiogondim/fast-memoize.js/master/src/index.js?compression=gzip"> <img src="https://codecov.io/gh/caiogondim/fast-memoize.js/branch/master/graph/badge.svg" alt="Code coverage"> <a href="https://www.npmjs.com/package/fast-memoize"><img src="https://img.shields.io/npm/v/fast-memoize.svg" /></a>
</div>

<br>

> In computing, memoization is an optimization technique used primarily to speed up computer programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again.
> — Wikipedia

This library is an attempt to make the **fastest possible memoization library in
JavaScript that supports *N* arguments**.

## Installation

```shell
npm install fast-memoize --save
```

## Usage

```js
const memoize = require('fast-memoize')

const fn = function (one, two, three) { /* ... */ }

const memoized = memoize(fn)

memoized('foo', 3, 'bar')
memoized('foo', 3, 'bar') // Cache hit
```

### Custom cache

The fastest cache is used for the running environment, but it is possible to
pass a custom cache to be used.

```js
const memoized = memoize(fn, {
  cache: {
    create() {
      var store = {};
      return {
        has(key) { return (key in store); },
        get(key) { return store[key]; },
        set(key, value) { store[key] = value; }
      };
    }
  }
})
```

The custom cache should be an object containing a `create` method that returns
an object implementing the following methods:
- `get`
- `set`
- `has`

### Custom serializer

To use a custom serializer:
```js
const memoized = memoize(fn, {
  serializer: customSerializer
})
```

The serializer is a function that receives one argument and outputs a string
that represents it. It has to be a
[deterministic algorithm](https://en.wikipedia.org/wiki/Deterministic_algorithm)
meaning that, given one input, it always returns the same output.

## Benchmark

For an in depth explanation on how this library was created, go read
[this post on RisingStack](https://community.risingstack.com/the-worlds-fastest-javascript-memoization-library/).

Below you can see a performance benchmark between some of the most popular libraries
for memoization.

<img src="http://rawgit.com/caiogondim/fast-memoize/master/img/benchmark.png" width="100%" />

To run the benchmark, clone the repo, install the dependencies and run `npm run benchmark`.
```shell
git clone git@github.com:caiogondim/fast-memoize.git
cd fast-memoize
npm install
npm run benchmark
```

<img src="http://rawgit.com/caiogondim/fast-memoize/master/img/benchmark-cli.gif" width="100%" />

### Against another git hash

To benchmark the current code against a git hash, branch, ...

```shell
npm run benchmark:compare 53fa9a62214e816cf8b5b4fa291c38f1d63677b9
```

### Gotchas

#### Rest & Default Parameters

We check for `function.length` to get upfront the expected number of arguments
in order to use the fastest strategy. But when rest & default parameters are being used, we don't receive the right number of arguments ([see details](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length#Description)).

```js
// Rest parameter example
function multiply (multiplier, ...theArgs) {
  return theArgs.map(function (element) {
    return multiplier * element
  })
}
multiply.length // => 1

// Default parameter example
function divide (element, divisor = 1) {
  return divisor * element
}
divide.length // => 1
```

So if you use [rest](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) & [default](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters) parameters, explicitly set the strategy to variadic.

```js
const memoizedMultiply = memoize(multiply, {
  strategy: memoize.strategies.variadic
})
```

#### Function Arguments

The default serializer uses `JSON.stringify` which will serialize functions as
`null`. This means that if you are passing any functions as arguments you will
get the same output regardless of whether you pass in different functions or
indeed no function at all. The cache key generated will always be the same. To
get around this you can give each function a unique ID and use that.

```js
let id = 0
function memoizedId(x) {
  if (!x.__memoizedId) x.__memoizedId = ++id
  return { __memoizedId: x.__memoizedId }
}

memoize((aFunction, foo) => {
  return aFunction.bind(foo)
}, {
  serializer: args => {
    const argumentsWithFuncIds = Array.from(args).map(x => {
      if (typeof x === 'function') return memoizedId(x)
      return x
    })
    return JSON.stringify(argumentsWithFuncIds)
  }
})
```

## Credits
- Icon by Mary Rankin from the Noun Project
- [Bullet train ZSH theme](https://github.com/caiogondim/bullet-train-oh-my-zsh-theme)

---

[caiogondim.com](https://caiogondim.com) &nbsp;&middot;&nbsp;
GitHub [@caiogondim](https://github.com/caiogondim) &nbsp;&middot;&nbsp;
Twitter [@caio_gondim](https://twitter.com/caio_gondim)
