/*jshint node: true*/

const crypto = require('crypto');
const esm = require('esm')(module);
const { expect } = require('chai');
const { default: sha1 } = esm('../sha1');

const encoding = 'hex';

// test vectors from http://www.bichlmeier.info/sha256test.html
// ... plus a load more

const VECTORS = [
  '',
  'abc',
  'sync-sha1',
  'message digest',
  'secure hash algorithm',
  'SHA256 is considered to be saf',
  'SHA256 is considered to be safe',
  'SHA256 is considered to be safe.',
  'SHA256 is considered to be safe..................',
  'SHA256 is considered to be safe...................',
  'SHA256 is considered to be safe....................',
  'SHA256 is considered to be safe.....................',
  'SHA256 is considered to be safe......................',
  'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq',
  'For this sample, this 63-byte string will be used as input data',
  'This is exactly 64 bytes long, not counting the terminating byte',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vitae cras amet.',

  // Here are some strings with non-ascii characters in them
  'Q£$%£!"@%$@%^£"!214',
  'Þetta er einhver kaldur íslenskum texta',
  'Online översättningstjänster är mycket användbara',
  'Null characters\0 are bad',
  '\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff'

  // Add any more strings in here if you'd like
];

// Also add strings "xxxx.....xxxx" of length 0..2048
for (let i = 0; i <= 2048; i += 1) {
  VECTORS.push('x'.repeat(i + 1));
}

for (let i = 0; i < 22; i += 1) {
  VECTORS.push('x'.repeat(Math.pow(2, i) + 1));
}

for (let i = 0; i < 19; i += 1) {
  VECTORS.push(randBin32().repeat(Math.pow(2, i) + 1));
}

/*globals describe, it*/
function runTests(algo, func) {
    describe(`${algo}(str)`, () => {
        it(`should hash like Node's crypto`, () => {
            VECTORS.forEach((message) => {
                // use Node's built in crypto as our reference value
                const expected = hash(algo, message, 'utf8');
                const result   = func(message, true).toString(encoding);
                expect(result).to.equal(expected, message);
            });
        });
    });

    describe(`${algo}(buf: Uint8Array)`, () => {
        const { str2buffer } = esm('string-encode');
        it(`should hash binary arrays (Uint8Array)`, () => {
            VECTORS.slice(0, 1000).forEach((message) => {
                let bin = str2buffer(message, true);
                let buf = Buffer.from(bin);
                const expected = hash(algo, buf);
                const result   = func(bin).toString(encoding);
                expect(result).to.equal(expected, message);
            });

            let bin = str2buffer(randBin32()+randBin32(), false);
            let buf = Buffer.from(bin);
            let expected = hash(algo, buf);
            let result   = func(bin).toString(encoding);
            expect(result).to.equal(expected, 'randBin32');

            result   = func(buf).toString(encoding);
            expect(result).to.equal(expected, 'randBin32 as Buffer');
        });
    });
}

runTests('sha1', sha1);


function packInt32(i32) {
    return String.fromCharCode.call(String, i32&0xff, (i32>>=8)&0xff, (i32>>=8)&0xff, (i32>>=8)&0xff);
}

function randBin32() {
    return packInt32(Math.random()*Date.now()>>>0);
}

function hash(algo, message, messageEncoding) {
    return crypto.createHash(algo)
        .update(message, messageEncoding)
        .digest(encoding)
    ;
}
