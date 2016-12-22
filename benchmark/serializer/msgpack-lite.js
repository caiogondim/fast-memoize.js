const msgpackEncode = require('msgpack-lite').encode

function serializer () {
  return msgpackEncode(arguments)
}
serializer.label = 'msgpack-lite'

module.exports = serializer
