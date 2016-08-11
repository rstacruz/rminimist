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

- Booleans never default to false.

  ```js
  minimist(['--debug'], { boolean: [ 'debug', 'verbose' ] })

  // minimist
  { _: [], debug: true, verbose: false }

  // rminimist
  { _: [], debug: true }
  ```
