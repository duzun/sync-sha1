import rawSha1 from './rawSha1';
import {
    str2buffer,
    toString,
} from 'string-encode';

export default function sha1(str, asUtf8) {
    let buf = str && str.BYTES_PER_ELEMENT ? str : str2buffer(str, asUtf8);
    buf = rawSha1(buf);
    buf.toString = toString;
    return buf;
}
