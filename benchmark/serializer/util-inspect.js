import { inspect } from 'util'

export default function serialize () {
  return inspect(arguments)
}

serialize.label = 'util-inspect'
