<img src="http://rawgit.com/caiogondim/fast-memoize/master/img/icon.svg" width="100%" />

<h1 align="center">fast-memoize.js</h1>

<div align="center">
  <img src="http://travis-ci.org/caiogondim/fast-memoize.js.svg?branch=master" alt="Travis CI">  <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg" alt="JS standard style">
</div>

<br>

> In computing, memoization is an optimization technique used primarily to speed up computer programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again.
> — Wikipedia

This library is an attempt to make the **fastest possible memoization library in
JavaScript that supports *N* arguments**.

There are already very popular solutions for this problem, but they are **not
fast enough** or accept **only one argument**.

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

The fastest cache is used for the running enviroment, but it is possible to
pass a custom cache to be used.

```js
const memoized = memoize(fn, {
  cache: customCache
})
```

The custom cache must implement the following methods:
- `get`
- `set`
- `has`
- `delete`

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

### TTL

You can pass an optional TTL value as an option. After this time when a cache
key is retrieved it will be marked as invalid, removed, and the value recomputed.

You can also set data to be automaticaly be removed at the end of the TTL rather
than just removed when accessed.

```js
const memoized = memoize(fn, {
  ttl: 120000, // time in ms
  autoExpire: true // Defaults to false.
})
```

## Benchmark

There is already plenty of libraries that does memoization on JS world.
[underscore](http://underscorejs.org/) and [lodash](https://lodash.com) provides
it, but they don't accept more than one argument.
[memoizee](https://www.npmjs.com/package/memoizee) is a very well written
library that supports *N* arguments, but is not even close on performance to
[lodash](https://lodash.com).

Below you can see a performance benchmark between some of the most popular libraries
for memoization.

<img src="http://rawgit.com/caiogondim/fast-memoize/master/img/benchmark-chart.png" width="100%" />

[fast-memoize](https://github.com/caiogondim/fast-memoize) is faster than any
other library but [lodash](https://lodash.com). The reason why is that
[lodash](https://lodash.com) does not support *N* arguments and is very
optimized to that unique use case. But even though, *fast-memoize* is the
library that supports *N* that comes closer to it.

To run the benchmark, clone the repo, install the dependencies and run `npm run benchmark`.
```shell
git clone git@github.com:caiogondim/fast-memoize.git
cd fast-memoize
npm install
npm run benchmark
```

<img src="http://rawgit.com/caiogondim/fast-memoize/master/img/benchmark-cli.png" width="100%" />

## Support

### Desktop browsers

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) |  ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) |  ![Brave](https://raw.github.com/alrra/browser-logos/master/src/brave/brave_48x48.png) |
| --- | --- | --- | --- | --- | --- | --- |
| Latest | 8+ | Latest | Latest | Latest | Latest | Latest |

### Mobile browsers

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png) | ![Android Browser](https://raw.github.com/alrra/browser-logos/master/src/android/android_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) |  ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![UC](https://raw.github.com/alrra/browser-logos/master/src/uc/uc_48x48.png) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Latest | 6+ | 4.0+ | 8+ | Latest | Latest | Latest |

### Server

| <a href="https://nodejs.org"><img height=48 src="https://raw.githubusercontent.com/caiogondim/javascript-server-side-logos/master/node.js/standard/454x128.png"></a> |
| --- |
| 0.10+ ✔ |

## Reference
- https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments

## Credits
- Icon by Mary Rankin from the Noun Project
- [Bullet train ZSH theme](https://github.com/caiogondim/bullet-train-oh-my-zsh-theme)

---

[caiogondim.com](https://caiogondim.com) &nbsp;&middot;&nbsp;
GitHub [@caiogondim](https://github.com/caiogondim) &nbsp;&middot;&nbsp;
Twitter [@caio_gondim](https://twitter.com/caio_gondim)
