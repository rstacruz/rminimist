/*
 * Object.assign semi-polyfill
 * (only enough for our purposes at least)
 */

var assign = Object.assign || function (dest, src) {
  for (var key in src) {
    if (src.hasOwnProperty(key)) {
      dest[key] = src[key]
    }
  }
  return dest
}

/*
 * Parses `args`.
 *
 * Options:
 *
 * - `string`
 * - `boolean`
 * - `alias`
 * - `default`
 * - `stopEarly`
 * - `--`
 * - `unknown`
 */

function rminimist (args, options) {
  if (!options) options = {}
  var result = { _: [] }

  if (options.default) {
    assign(result, options.default)
  }

  return pass(args, options, result)
}

/*
 * Internal: parse `args` via recursion.
 */

function pass (args, options, result) {
  if (args.length === 0) return result

  var arg = args.shift()

  var m
  if ((m = arg.match(/^-([a-zA-Z0-9])$/))) {
    return push(m[1], undefined, arg, args, options, result)
  } else if ((m = arg.match(/^-([a-zA-Z0-9])([0-9].*?)$/))) {
    return push(m[1], m[2], arg, args, options, result)
  } else if ((m = arg.match(/^--([a-zA-Z0-9]+)$/))) {
    return push(m[1], undefined, arg, args, options, result)
  } else if ((m = arg.match(/^--no-([a-zA-Z0-9]+)$/))) {
    return push(m[1], false, arg, args, options, result)
  } else if ((m = arg.match(/^--([a-zA-Z0-9]+)=(.*?)$/))) {
    return push(m[1], m[2], arg, args, options, result)
  } else if (options['--'] && arg === '--') {
    result._ = result._.concat(args)
    return result
  } else {
    result._.push(arg)
    return pass(args, options, result)
  }
}

/*
 * Internal: push a value.
 */

function push (key, value, arg, args, options, result) {
  // Account for aliases
  var alias = options.alias && options.alias[key]
  if (alias) key = alias

  var hasValue = typeof value !== 'undefined'

  if (has(options.boolean, key)) {
    // Boolean
    result[key] = hasValue ? cast(value) : true
  } else if (has(options.string, key)) {
    // String
    if (args.length === 0 && !hasValue) {
      throw new Error(flag(key) + ' requires a string')
    }
    result[key] = hasValue ? cast(value) : cast(args.shift())
  } else if (options.stopEarly) {
    // Not recognized, and stop early
      result._ = result._.concat([arg]).concat(args)
      return result
  } else if (args.length === 0 && !hasValue) {
    // Not recognized, and boolean
    result[key] = true
  } else {
    // Not recognized, and has value
    result[key] = hasValue ? cast(value) : cast(args.shift())
  }

  return pass(args, options, result)
}

/*
 * Turns values into numbers if needed.
 */

function cast (value) {
  if (typeof value !== 'string') {
    return value
  } else if (isNaN(+value)) {
    return value
  } else {
    return +value
  }
}

/*
 * Internal: checks if the array `haystack` has element `needle`.
 */

function has (haystack, needle) {
  return haystack && (haystack.indexOf(needle) > -1)
}

function flag (key) {
  if (key.length === 1) {
    return '-' + key
  } else {
    return '--' + key
  }
}

module.exports = rminimist
