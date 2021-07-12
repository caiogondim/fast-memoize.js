function hasSupport () {
  let hasSupport = true

  try {
    const map = new Map()
    map.set(null)
  } catch (error) {
    hasSupport = false
  }

  return hasSupport
}

function create () {
  const cache = new Map()
  return cache
}

export default {
  create: create,
  hasSupport: hasSupport,
  label: 'Map'
}
