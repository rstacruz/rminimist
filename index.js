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
  if ((m = arg.match(/^-([a-zA-Z0-9]+)$/))) {
    return push(m[1].split(''), undefined, arg, args, options, result)
  } else if ((m = arg.match(/^--([a-zA-Z0-9]+)$/))) {
    return push([m[1]], undefined, arg, args, options, result)
  } else if ((m = arg.match(/^--no-([a-zA-Z0-9]+)$/))) {
    return push([m[1]], false, arg, args, options, result)
  } else if ((m = arg.match(/^--([a-zA-Z0-9]+)=(.*?)$/))) {
    return push([m[1]], m[2], arg, args, options, result)
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

function push (keys, value, arg, args, options, result) {
  var hasValue = typeof value !== 'undefined'

  for (var i in keys) {
    var key = keys[i]
    var val
    // Account for aliases
    var alias = options.alias && options.alias[key]
    if (alias) key = alias

    if (has(options.boolean, key)) {
      // Boolean
      val = hasValue ? value : true
      result = setResult(result, key, val, options)
    } else if (has(options.string, key)) {
      // String
      if (args.length === 0 && !hasValue) {
        throw new Error(flag(key) + ' requires a string')
      }
      val = hasValue ? value : args.shift()
      result = setResult(result, key, val, options)
    } else if (has(options.number, key)) {
      // Number
      if (args.length === 0 && !hasValue) {
        throw new Error(flag(key) + ' requires a number')
      }
      val = +(hasValue ? value : args.shift())
      if (isNaN(val)) {
        throw new Error(flag(key) + ' requires a number')
      }
      result = setResult(result, key, val, options)
    } else if (options.stopEarly) {
      // Not recognized, and stop early
        result._ = result._.concat([arg]).concat(args)
        return result
    } else if (args.length === 0 && !hasValue) {
      // Not recognized, and boolean
      result = setResult(result, key, true, options)
    } else if (hasValue) {
      // Not recognized, and has value
      result = setResult(result, key, value, options)
    } else if (args[0].substr(0, 1) === '-') {
      // Not recognized, and has flag afterwards
      result = setResult(result, key, true, options)
    } else {
      // Not recognized, and has string afterwards
      result = setResult(result, key, args.shift(), options)
    }
  }

  return pass(args, options, result)
}

/*
 * Internal: sets `key` to `value` in `result` as needed.
 * Takes arrays into consideration.
 */

function setResult (result, key, value, options) {
  if (has(options.array, key)) {
    if (result[key]) {
      result[key].push(value)
    } else {
      result[key] = [value]
    }
  } else {
    delete result[key]
    result[key] = value
  }
  return result
}

/*
 * Internal: checks if the array `haystack` has element `needle`.
 */

function has (haystack, needle) {
  return haystack && (haystack.indexOf(needle) > -1)
}

function flag (key) {
  return (key.length === 1 ? '-' : '--') + key
}

module.exports = rminimist
