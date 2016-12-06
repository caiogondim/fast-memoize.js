'use strict'

class ObjectWithoutPrototypeCache {
  constructor () {
    this._cache = Object.create(null)
    this._name = 'Object without prototype'
  }

  has (key) {
    return (key in this._cache)
  }

  get (key) {
    return this._cache[key]
  }

  set (key, value) {
    this._cache[key] = value
  }

  delete (key) {
    delete this._cache[key]
  }
}

module.exports = ObjectWithoutPrototypeCache
