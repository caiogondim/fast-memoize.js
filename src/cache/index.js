'use strict'

var mapCache = require('./map')
var objectCache = require('./object')

function create () {
  var cache

  if (mapCache.hasSupport()) {
    cache = mapCache.create()
  } else {
    cache = objectCache.create()
  }

  return cache
}

module.exports = {
  create: create
}
