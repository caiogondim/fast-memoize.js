import LruCache from 'lru-cache'

export default {
  create: () => new LruCache(),
  label: 'lru-cache'
}
