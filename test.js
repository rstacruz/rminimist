var test = require('tape')
var rminimist = require('./index')

test('rminimist', function (t) {
  var result

  result = rminimist(['-a'])
  t.deepEqual(result, {
    _: [],
    a: true
  }, '-a')

  result = rminimist(['-a4'])
  t.deepEqual(result, {
    _: [],
    a: 4
  }, '-a4')

  result = rminimist(['-a'], { alias: { 'a': 'accept' } })
  t.deepEqual(result, {
    _: [],
    accept: true
  }, '-a alias')

  result = rminimist(['-f', 'hi.txt'], { string: ['f'] })
  t.deepEqual(result, {
    _: [],
    f: 'hi.txt'
  }, 'string: -f hi.txt')

  result = rminimist(['-f', 'hi.txt', 'hello'], { string: ['f'] })
  t.deepEqual(result, {
    _: ['hello'],
    f: 'hi.txt',
  }, 'rest')

  try {
    result = rminimist(['-f'], { string: ['f'] })
  } catch (err) {
    t.deepEqual(err.message, '-f requires a string', 'string required, -')
  }

  try {
    result = rminimist(['--file'], { string: ['file'] })
  } catch (err) {
    t.deepEqual(err.message, '--file requires a string', 'string required, --')
  }

  result = rminimist(['--no-debug'], { boolean: ['debug'] })
  t.deepEqual(result, {
    _: [],
    debug: false
  }, '--no-debug')

  result = rminimist(['--file=hi.txt'], { string: ['file'] })
  t.deepEqual(result, {
    _: [],
    file: 'hi.txt'
  }, 'string: --file=hi.txt')

  result = rminimist(['--', '--file=hi.txt'], { string: ['file'], '--': true })
  t.deepEqual(result, {
    _: ['--file=hi.txt']
  }, '--')

  result = rminimist(['--file=hi.txt', '-x'], { string: ['file'], stopEarly: true })
  t.deepEqual(result, {
    _: ['-x'],
    file: 'hi.txt'
  }, 'stopEarly')

  result = rminimist(['--file=hi.txt', '-x'], { stopEarly: true })
  t.deepEqual(result, {
    _: ['--file=hi.txt', '-x']
  }, 'stopEarly only')

  result = rminimist(['--file=hi.txt', '-x', 'y', 'z'])
  t.deepEqual(result, {
    _: ['z'],
    'file': 'hi.txt',
    'x': 'y'
  }, 'mixed')

  result = rminimist(['--file=hi.txt'], { default: { x: true } })
  t.deepEqual(result, {
    _: [],
    'x': true,
    'file': 'hi.txt'
  }, 'default')

  result = rminimist(['--file=hi.txt'], { default: { x: true } })
  t.deepEqual(result, {
    _: [],
    'x': true,
    'file': 'hi.txt'
  }, 'default overriding')

  // result = rminimist(['-x', '3', '-y', '4', '-n5', '-abc', '--beep=boop', 'foo', 'bar', 'baz'])

  t.end()
})
