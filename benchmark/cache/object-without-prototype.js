class ObjectWithoutPrototypeCache {
  constructor () {
    this._cache = Object.create(null)
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

module.exports = {
  create: () => new ObjectWithoutPrototypeCache(),
  name: 'Object without prototype'
}
