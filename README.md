# sync-sha1 [![Build Status](https://travis-ci.org/duzun/sync-sha1.svg?branch=master)](https://travis-ci.org/duzun/sync-sha1)

Synchronous sha1 in JavaScript

Shamelessly stolen from [jbt/tiny-hashes](https://github.com/jbt/tiny-hashes) and improved.

It is basically a synchronous `sha1()` hash function for browsers, with no guaranties.

The improvement consists in the usage of the `Uint32Array` instead of `Array` internaly
and compatibility with `Uint8Array` on input/output.

For Node.js you should use the [`crypto`](https://nodejs.org/api/crypto.html#crypto_crypto) module!

## Usage

### The Easy way

```js
var sha1 = require('sync-sha1');

sha1('sync-sha1').toString('hex'); // "150f7d2a6e9f80f03c639b17878bce65b5a033a8"
```

### The Tiny way

```js
import sha1 from 'sync-sha1/rawSha1'; // rollup.js ?

const buffer = new Uint8Array('sync-sha1'.split('').map((c) => c.charCodeAt(0)));
const hash = sha1(buffer);
hash.reduce((r, c) => r += (c >>> 0).toString(16).padStart(2,'0'), ''); // "150f7d2a6e9f80f03c639b17878bce65b5a033a8"
```

### The Native Browser way

```js
import sha1 from 'sync-sha1/asyncSha1'; // rollup.js ?

const hash = await sha1('sync-sha1');
hash.toString('hex'); // "150f7d2a6e9f80f03c639b17878bce65b5a033a8"
```

Direct Browser include:

```html
<script src="https://unpkg.com/sync-sha1"></script>
```

Use it at your own risk!
