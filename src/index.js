'use strict'
const util = require('util')
//
// Main
//

module.exports = function memoize (fn, options) {
  var cache
  var serializer
  var strategy

  if (options && options.cache) {
    cache = options.cache
  } else {
    cache = cacheDefault
  }

  if (options && options.serializer) {
    serializer = options.serializer
  } else {
    serializer = serializerDefault
  }

  if (options && options.strategy) {
    strategy = options.strategy
  } else {
    strategy = strategyDefault
  }

  return strategy(fn, {
    cache,
    serializer
  })
}

//
// Strategy
//

function isPrimitive (value) {
  return value == null || (typeof value !== 'function' && typeof value !== 'object')
}

function strategyDefault (fn, options) {
  function monadic (fn, cache, serializer, arg) {
    var cacheKey
    if (isPrimitive(arg)) {
      cacheKey = arg
    } else {
      cacheKey = serializer(arg)
    }

    if (!cache.has(cacheKey)) {
      var computedValue = fn.call(this, arg)
      cache.set(cacheKey, computedValue)
      return computedValue
    }

    return cache.get(cacheKey)
  }

  function variadic (fn, cache, serializerrgs) {
    for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    var cacheKey = serializer(args)

    if (!cache.has(cacheKey)) {
      var computedValue = fn.apply(this, args)
      cache.set(cacheKey, computedValue)
      return computedValue
    }

    return cache.get(cacheKey)
  }

  var memoized = fn.length === 1 ?
    monadic :
    variadic

  memoized = memoized.bind(
    this,
    fn,
    options.cache.create(),
    options.serializer
  )

  arguments[0] = memoized

  return memoized
}

//
// Serializer
//

function customReplacer(args) {
  var cache = [];
  const replacer = function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return
      }
      // Store value in our collection
      cache.push(value)
    }
  }
  cache = null // Enable garbage collection
  return replacer
}

//
// Serializer
//

function serializerDefault () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key]
  }

  try {
    // try the fastest way first.
    return JSON.stringify(args)
  } catch (error) {
    if (error instanceof TypeError &&
      error.message === 'Converting circular structure to JSON') {
      // if node
      if (util && util.inspect) {
        return JSON.stringify(util.inspect(args))
      } else {
        return JSON.stringify(args, customReplacer)
      }
    } else {
      throw error // let others bubble up
    }
  }
}

//
// Cache
//

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ObjectWithoutPrototypeCache = function () {
  function ObjectWithoutPrototypeCache() {
    _classCallCheck(this, ObjectWithoutPrototypeCache);

    this.cache = Object.create(null);
  }

  _createClass(ObjectWithoutPrototypeCache, [{
    key: "has",
    value: function has(key) {
      return key in this.cache;
    }
  }, {
    key: "get",
    value: function get(key) {
      return this.cache[key];
    }
  }, {
    key: "set",
    value: function set(key, value) {
      this.cache[key] = value;
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      delete this.cache[key];
    }
  }]);

  return ObjectWithoutPrototypeCache;
}();

var cacheDefault = {
  create: function create() {
    return new ObjectWithoutPrototypeCache();
  }
};