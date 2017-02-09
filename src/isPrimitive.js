const isPrimitive = (value) =>
  value == null || (typeof value !== 'function' && typeof value !== 'object')

module.exports = isPrimitive;