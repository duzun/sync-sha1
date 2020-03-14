(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.sha1 = factory());
}(this, (function () { 'use strict';

    /**
     * Convert different types of JavaScript String to/from Uint8Array.
     *
     * @author Dumitru Uzun (DUzun.Me)
     * @version 0.2.1
     */

    /*requires Uint8Array*/

    /*globals escape, unescape, encodeURI, decodeURIComponent, btoa*/
    var chr = String.fromCharCode;
    function buffer2bin(buf) {
      buf = view8(buf);
      return chr.apply(String, buf);
    }
    /**
     * Get the hex representation of a buffer (TypedArray)
     *
     * @requires String.prototype.padStart()
     *
     * @param   {TypedArray}  buf Uint8Array is desirable, cause it is consistent regardless of the endianness
     *
     * @return  {String} The hex representation of the buf
     */

    function buffer2hex(buf) {
      var bpe = buf.BYTES_PER_ELEMENT << 1;
      return buf.reduce(function (r, c) {
        return r += (c >>> 0).toString(16).padStart(bpe, '0');
      }, '');
    }
    function buffer2str(buf, asUtf8) {
      if (typeof buf == 'string') return buf;
      buf = buffer2bin(buf);

      if (asUtf8 !== false && !isASCII(buf)) {
        if (asUtf8) {
          buf = utf8Decode(buf);
        } else if (asUtf8 == undefined) {
          try {
            buf = utf8Decode(buf);
          } catch (err) {}
        }
      }

      return buf;
    }
    function str2buffer(str, asUtf8) {
      str = String(str);

      if (asUtf8 == undefined) {
        // Some guessing
        asUtf8 = hasMultibyte(str); // || !isASCII(str)
      }

      if (asUtf8) {
        str = utf8Encode(str);
      } // Smaller x2
      // return new Uint8Array(String(str).split('').map(ord));
      // Faster x3-4


      var len = str.length;
      var buf = new Uint8Array(len);

      while (len--) {
        buf[len] = str.charCodeAt(len);
      }

      return buf;
    }
    /**
     * This method is a replacement of Buffer.toString(enc)
     * for Browser, where Buffer is not available.
     *
     * @requires btoa
     *
     * @this {Uint8Array}
     *
     * @param   {String}  enc  'binary' | 'hex' | 'base64' | 'utf8' | undefined
     *
     * @return  {String}
     */

    function toString(enc) {
      // The Node.js equivalent would be something like:
      // if(typeof Buffer == 'function') {
      //     if(enc === false) enc = 'binary';
      //     if(enc === true) enc = 'utf8';
      //     return Buffer.from(this.buffer, this.byteOffset, this.byteLength).toString(enc);
      // }
      switch (enc) {
        case false:
        case 'binary':
          return buffer2bin(this);

        case 'hex':
          return buffer2hex(this);

        case 'base64':
          return btoa(buffer2bin(this));

        case 'utf8':
          enc = true;
          break;
      }

      return buffer2str(this, enc);
    }
    function view8(buf, start, len) {
      // If buf is a Buffer, we still want to make it an Uint8Array
      if (!start && !len && buf instanceof Uint8Array && !buf.copy) return buf;
      start = start >>> 0;
      if (len == undefined) len = buf.byteLength - start;
      return new Uint8Array(buf.buffer, buf.byteOffset + start, len);
    }

    var _isLittleEndian;

    function isLittleEndian() {
      if (_isLittleEndian !== undefined) return _isLittleEndian;
      _isLittleEndian = !!new Uint8Array(new Uint16Array([1]).buffer)[0];

      isLittleEndian = function isLittleEndian() {
        return _isLittleEndian;
      };

      return _isLittleEndian;
    }
    function switchEndianness32(i) {
      return (i & 0xFF) << 24 | (i & 0xFF00) << 8 | i >> 8 & 0xFF00 | i >> 24 & 0xFF;
    }
    var hasMultibyteRE = /([^\x00-\xFF])/;
    var isASCIIRE = /^[\x00-\x7F]*$/;
    function hasMultibyte(str) {
      var m = hasMultibyteRE.exec(str);
      return m ? m[1] : false;
    }
    function isASCII(str) {
      return isASCIIRE.test(str);
    }
    function utf8Encode(str) {
      return unescape(encodeURI(str));
    }
    function utf8Decode(str) {
      return decodeURIComponent(escape(str));
    }

    /**
     * SHA1 on binary array
     *
     * @param   {Uint8Array}  b  Data to hash
     *
     * @return  {Uint8Array}  sha1 hash
     */

    function rawSha1(b) {
      var i = b.byteLength,
          bs = 0,
          A,
          B,
          C,
          D,
          G,
          H = Uint32Array.from([A = 0x67452301, B = 0xEFCDAB89, ~A, ~B, 0xC3D2E1F0]),
          W = new Uint32Array(80),
          nrWords = i / 4 + 2 | 15,
          words = new Uint32Array(nrWords + 1),
          j;
      words[nrWords] = i * 8;
      words[i >> 2] |= 0x80 << (~i << 3);

      for (; i--;) {
        words[i >> 2] |= b[i] << (~i << 3);
      }

      for (A = H.slice(); bs < nrWords; bs += 16, A.set(H)) {
        for (i = 0; i < 80; A[0] = (G = ((b = A[0]) << 5 | b >>> 27) + A[4] + (W[i] = i < 16 ? words[bs + i] : G << 1 | G >>> 31) + 0x5A827999, B = A[1], C = A[2], D = A[3], G + ((j = i / 5 >> 2) ? j != 2 ? (B ^ C ^ D) + (j & 2 ? 0x6FE0483D : 0x14577208) : (B & C | B & D | C & D) + 0x34994343 : B & C | ~B & D)), A[1] = b, A[2] = B << 30 | B >>> 2, A[3] = C, A[4] = D, ++i) {
          G = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
        }

        for (i = 5; i;) {
          H[--i] = H[i] + A[i];
        }
      }

      if (isLittleEndian()) {
        H = H.map(switchEndianness32);
      }

      return new Uint8Array(H.buffer, H.byteOffset, H.byteLength);
    }

    function sha1(str, asUtf8) {
      var buf = str && str.BYTES_PER_ELEMENT ? str : str2buffer(str, asUtf8);
      buf = rawSha1(buf);
      buf.toString = toString;
      return buf;
    }

    return sha1;

})));
//# sourceMappingURL=sha1.js.map
