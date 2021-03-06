# rminimist

> Parse argument options

This works exactly like [minimist][], with a few exceptions (see [difference with minimist](#difference-with-minimist)).

[![Status](https://travis-ci.org/rstacruz/rminimist.svg?branch=master)](https://travis-ci.org/rstacruz/rminimist "See test builds")

## Usage

```
npm install --save rminimist
```

```js
var argv = require('rminimist')(process.argv.slice(2))
```

## API

### rminimist

> `rminimist(args, [options])`

Return an argument object argv populated with the array arguments from `args`.

`argv._` contains all the arguments that didn't have an option associated with them.

Any arguments after `--` will not be parsed and will end up in `argv._`.

Options can be:

- `opts.string` - an array of strings argument names to always treat as strings
- `opts.boolean` - an array of strings to always treat as booleans.
- `opts.array` - an array of strings to treat as arrays. (only in rminimist)
- `opts.number` - an array of strings to treat as numbers. (only in rminimist)
- `opts.alias` - an object mapping string names to strings or arrays of string argument names to use as aliases
- `opts.default` - an object mapping string argument names to default values
- `opts.stopEarly` - when true, populate *argv._* with everything after the first non-option
- `opts['--']` - when true, populate *argv._* with everything before the *--* and *argv['--']* with everything after the *--*.

See [minimist] for more details and examples.

## Difference with minimist

rminimist tries to be less "smart" than minimist. While minimist is often usable with minimal options, rminimist prefers you to be explicit.

- Aliases are not duplicated. They will always resolve to the canonical version.

  ```js
  minimist(['-f', 'document.txt'], { alias: { f: 'file' } })

  // minimist
  { _: [], f: 'document.txt', file: 'document.txt' }

  // rminimist
  { _: [], file: 'document.txt' }
  ```

- The syntax `-n4` (short flag + number) is not supported. This improves compatibility with number flags (eg, `-1`).

  ```js
  minimist(['-n4'])

  // minimist
  { _: [], n: 4 }

  // rminimist
  { '4': true, _: [], n: true }
  ```

- Booleans don't default to `false`. They're simply not defined if not present.

  ```js
  minimist(['--debug'], { boolean: [ 'debug', 'verbose' ] })

  // minimist
  { _: [], debug: true, verbose: false }

  // rminimist
  { _: [], debug: true }
  ```

- Values are overridden, not appended as an array. Use the `array` option to explicitly enable the array behavior.

  ```js
  minimist(['--watch=lib', '--watch=test'])

  // minimist
  { _: [], watch: ['lib', 'test'] }

  // rminimist
  { _: [], watch: 'test' }
  ```

- A new option `array` is introduced to make values into an array.

  ```js
  minimist(['--watch=lib', '--watch=test'], { array: ['watch'] })

  // rminimist
  { _: [], watch: ['lib', 'test'] }
  ```

- Order is always preserved (except for [numeric keys](http://ricostacruz.com/til/ordered-keys-in-js.html)).

  ```js
  minimist(['-a', '--file=doc.txt'], { default: { file: 'default.txt' } })

  // minimist
  { _: [], file: 'doc.txt', a: true }

  // rminimist
  { _: [], a: true, file: 'doc.txt' }
  ```

- Number-like values are never auto-cast to numbers. Use the `number` option instead.

  ```js
  // minimist
  minimist(['--port', '4000'])
  { _: [], port: 4000 }

  // rminimist
  rminimist(['--port', '4000'])
  { _: [], port: '4000' }

  rminimist(['--port', '4000'], { number: ['port'] })
  { _: [], port: 4000 }
  ```

- `boolean: true` and `string: true` are not supported. Use the array syntax instead.

  ```js
  // minimist
  minimist(['-a', 'hello'], { boolean: true })

  // rminimist
  rminimist(['-a', 'hello'], { boolean: ['a'] })
  ```

- The `unknown` option is not supported.

## Thanks

**rminimist** © 2016+, Rico Sta. Cruz. Released under the [MIT] License.<br>
Authored and maintained by Rico Sta. Cruz with help from contributors ([list][contributors]).

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/rminimist/contributors
[minimist]: https://www.npmjs.com/package/minimist
