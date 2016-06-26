(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["fastMemoize"] = factory();
	else
		root["fastMemoize"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var cacheDefault = __webpack_require__(1)
	var serializerDefault = __webpack_require__(4)

	function memoize (fn, cache, serializer) {
	  if (!cache) {
	    cache = cacheDefault
	  }
	  if (!serializer) {
	    serializer = serializerDefault
	  }

	  function memoized () {
	    var cacheKey

	    if (arguments.length === 1) {
	      cacheKey = arguments[0]
	    } else {
	      cacheKey = serializer(arguments)
	    }

	    if (!memoized._cache.has(cacheKey)) {
	      memoized._cache.set(cacheKey, fn.apply(this, arguments))
	    }

	    return memoized._cache.get(cacheKey)
	  }

	  memoized._cache = cache.create()

	  return memoized
	}

	module.exports = memoize


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var mapCache = __webpack_require__(2)
	var objectCache = __webpack_require__(3)

	function create () {
	  var cache

	  if (mapCache.hasSupport()) {
	    cache = mapCache.create()
	  } else {
	    cache = objectCache.create()
	  }

	  return cache
	}

	module.exports = {
	  create: create
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict'

	function hasSupport () {
	  var hasSupport = true

	  try {
	    eval('new Map()')
	  } catch (error) {
	    hasSupport = false
	  } finally {
	    return hasSupport
	  }
	}

	function create () {
	  var cache = new Map()
	  cache._name = 'Map'
	  return cache
	}

	module.exports = {
	  create: create,
	  hasSupport: hasSupport
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict'

	function ObjectCache () {
	  this._cache = {}
	  // Removing prototype makes key lookup faster.
	  this._cache.prototype = null
	  this._name = 'Object'
	}

	ObjectCache.prototype.has = function (key) {
	  return (key in this._cache)
	}

	ObjectCache.prototype.get = function (key) {
	  return this._cache[key]
	}

	ObjectCache.prototype.set = function (key, value) {
	  this._cache[key] = value
	}

	// IE8 crashes if we use a method called `delete` with dot-notation.
	ObjectCache.prototype['delete'] = function (key) {
	  delete this._cache[key]
	}

	module.exports = {
	  create: function () {
	    return new ObjectCache()
	  }
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict'

	function jsonStringify () {
	  return JSON.stringify(arguments)
	}

	jsonStringify._name = 'jsonStringify'
	module.exports = jsonStringify


/***/ }
/******/ ])
});
;