<img src="http://rawgit.com/caiogondim/fast-memoize/master/img/icon.svg" width="100%" />

# fast-memoize

<img src="http://travis-ci.org/caiogondim/fast-memoize.js.svg?branch=master" alt="Travis CI"> <img src="http://david-dm.org/caiogondim/fast-memoize.js/dev-status.svg" alt="David DM"> [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)


> In computing, memoization is an optimization technique used primarily to speed up computer programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again.
> — Wikipedia

This library is an attempt to make the **fastest possible memoization library in
JavaScript that supports *N* arguments**.

There are already very popular solutions for this problem, but they are **not
fast enough** or accept **only one argument**.

## Installation

To use the library, install it through [npm](https://npmjs.com)

```shell
npm install fast-memoize
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

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) |  ![Edge](https://raw.github.com/alrra/browser-logos/master/edge/edge_48x48.png) |  ![Brave](https://raw.github.com/alrra/browser-logos/master/brave/brave_48x48.png) |
| --- | --- | --- | --- | --- | --- | --- |
| Latest | 8+ | Latest | Latest | Latest | Latest | Latest |

### Mobile browsers

| ![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari-ios/safari-ios_48x48.png) | ![Android Browser](https://raw.github.com/alrra/browser-logos/master/android/android_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) |  ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![UC](https://raw.github.com/alrra/browser-logos/master/uc/uc_48x48.png) |
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
