class ObjectWithoutPrototypeCache {
  constructor () {
    this.cache = Object.create(null)
  }

  has (key) {
    return (key in this.cache)
  }

  get (key) {
    return this.cache[key]
  }

  set (key, value) {
    this.cache[key] = value
  }

  delete (key) {
    delete this.cache[key]
  }
}

module.exports = {
  create: () => new ObjectWithoutPrototypeCache(),
  label: 'Object without prototype'
}
