'use strict'

function hasSupport () {
  var hasSupport = true

  try {
    eval('new Map()')
  } catch (error) {
    hasSupport = false
  } finally {
    return hasSupport
  }
}

function create () {
  var cache = new Map()
  cache._name = 'Map'
  return cache
}

module.exports = {
  create: create,
  hasSupport: hasSupport
}
