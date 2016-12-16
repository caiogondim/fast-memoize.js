class ObjectCache {
  constructor () {
    this._cache = {}
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
  create: () => new ObjectCache(),
  label: 'Object'
}
