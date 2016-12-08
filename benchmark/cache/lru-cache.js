var LruCache = require('lru-cache')

module.exports = {
  create: () => new LruCache(),
  name: 'lru-cache'
}
