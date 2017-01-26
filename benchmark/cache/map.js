function hasSupport () {
  var hasSupport = true

  try {
    var map = new Map()
    map.set(null)
  } catch (error) {
    hasSupport = false
  }

  return hasSupport
}

function create () {
  var cache = new Map()
  return cache
}

module.exports = {
  create: create,
  hasSupport: hasSupport,
  label: 'Map'
}
