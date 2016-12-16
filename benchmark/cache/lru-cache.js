var LruCache = require('lru-cache')

module.exports = {
  create: () => new LruCache(),
  label: 'lru-cache'
}
