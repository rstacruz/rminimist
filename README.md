# rminimist

> Parse argument options

This works exactly like [minimist](https://www.npmjs.com/package/minimist), with a few exceptions:

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
  { _: [], n: true, '4': true }
  ```

- Booleans don't default to `false`. They're simply not defined.

  ```js
  minimist(['--debug'], { boolean: [ 'debug', 'verbose' ] })

  // minimist
  { _: [], debug: true, verbose: false }

  // rminimist
  { _: [], debug: true }
  ```

- Values are overridden, not appended as an array.

  ```js
  minimist(['--watch=lib', '--watch=test'])

  // minimist
  { _: [], watch: ['lib', 'test'] }

  // rminimist
  { _: [], watch: 'test' }
  ```

- A new option `array` is introduced to make things into an array.

  ```js
  minimist(['--watch=lib', '--watch=test'], { array: ['watch'] })

  // rminimist
  { _: [], watch: ['lib', 'test'] }
  ```
