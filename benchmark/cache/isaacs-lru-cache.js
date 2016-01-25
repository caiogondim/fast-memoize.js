'use strict'

var IsaacsLruCache = require('lru-cache')

class LruCache extends IsaacsLruCache {
  constructor() {
    super()
    this._name = 'isaacs-lru-cache'
  }
}

module.exports = LruCache
