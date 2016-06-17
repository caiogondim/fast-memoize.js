'use strict'

function create () {
  var cache = new Map()
  cache._name = 'Map'
  return cache
}

module.exports = {
  create: create
}
