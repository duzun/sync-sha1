import { str2buffer, toString } from "string-encode";
import subtleHash from './subtleHash';

export default function asyncSha1(str, asUtf8) {
    let buf = str && str.BYTES_PER_ELEMENT ? str : str2buffer(str, asUtf8);

    return subtleHash('SHA-1', buf)
    .then((hash) => {
        hash.toString = toString;
        return hash;
    });
}
