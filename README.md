<img src="http://rawgit.com/caiogondim/fast-memoize/master/img/icon.svg" width="100%" />

# fast-memoize

<img src="http://travis-ci.org/caiogondim/fast-memoize.js.svg?branch=master" alt="Travis CI"> <img src="http://david-dm.org/caiogondim/fast-memoize.js/dev-status.svg" alt="David DM">

> In computing, memoization is an optimization technique used primarily to speed up computer programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again.
> — Wikipedia

This library is an attempt to make the **fastest possible memoization library in
JavaScript that supports *N* arguments**.

There are already very popular solutions for this problem, but they are **not
very fast enough** or accept **only one argument**.

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

const fn = function (one, two, three) { /* ... */ };

memoized = memoize(fn);

memoized('foo', 3, 'bar');
memoized('foo', 3, 'bar'); // Cache hit
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

<img src="http://rawgit.com/caiogondim/fast-memoize/master/img/benchmark.png" width="100%" />

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

## Support

![SauceLabs support matrix](http://soysauce.berabou.me/u/caiogondim.svg)

## Reference
- https://talideon.com/weblog/2005/07/javascript-memoization.cfm
- https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments

## Credits
- Icon by Mary Rankin from the Noun Project
- [Bullet train ZSH theme](https://github.com/caiogondim/bullet-train-oh-my-zsh-theme)
