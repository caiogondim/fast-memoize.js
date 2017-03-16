<img src="http://rawgit.com/caiogondim/fast-memoize/master/img/icon.svg" width="100%" />

<h1 align="center">fast-memoize.js</h1>

<div align="center">
  <img src="http://travis-ci.org/caiogondim/fast-memoize.js.svg?branch=master" alt="Travis CI"> <img src="http://img.badgesize.io/caiogondim/fast-memoize.js/master/src/index.js?compression=gzip"> <img src="https://codecov.io/gh/caiogondim/fast-memoize.js/branch/master/graph/badge.svg" alt="Code coverage">
</div>

<br>

> In computing, memoization is an optimization technique used primarily to speed up computer programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again.
> — Wikipedia

This library is an attempt to make the **fastest possible memoization library in
JavaScript that supports *N* arguments**.

## Installation

To use the library, install it through [npm](https://npmjs.com)

```shell
npm install fast-memoize --save
```

To port it to Browser or any other (non CJS) environment, use your favorite CJS
bundler. No favorite yet? Try: [Browserify](http://browserify.org/),
[Webmake](https://github.com/medikoo/modules-webmake) or
[Webpack](http://webpack.github.io/)

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

The custom cache should be an object containing a `create` method that returns an object implementing the following methods:
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
meaning that, given one input, it always give the same output.

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

## Credits
- Icon by Mary Rankin from the Noun Project
- [Bullet train ZSH theme](https://github.com/caiogondim/bullet-train-oh-my-zsh-theme)

---

[caiogondim.com](https://caiogondim.com) &nbsp;&middot;&nbsp;
GitHub [@caiogondim](https://github.com/caiogondim) &nbsp;&middot;&nbsp;
Twitter [@caio_gondim](https://twitter.com/caio_gondim)
