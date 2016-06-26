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
