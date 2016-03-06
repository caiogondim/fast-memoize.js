'use strict'

function jsonStringify () {
  return JSON.stringify(arguments)
}

jsonStringify._name = 'jsonStringify'
module.exports = jsonStringify
