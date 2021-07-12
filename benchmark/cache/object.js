class ObjectCache {
  constructor () {
    this.cache = {}
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

export default {
  create: () => new ObjectCache(),
  label: 'Object'
}
