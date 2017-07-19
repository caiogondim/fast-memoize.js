function hasSupport () {
  let hasSupport = true

  try {
    let map = new Map()
    map.set(null)
  } catch (error) {
    hasSupport = false
  }

  return hasSupport
}

function create () {
  let cache = new Map()

  return cache
}

module.exports = {
  create: create,
  hasSupport: hasSupport,
  label: 'Map'
}
