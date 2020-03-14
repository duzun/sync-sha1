/*jshint browser: true*/

function getSubtle() {
    const crypto = window.crypto || window.msCrypto || window.webkitCrypto;
    const subtle = crypto.subtle || crypto.webkitSubtle;
    return subtle;
}

export default function subtleHash(algo, buf) {
    const subtle = getSubtle();
    buf = subtle.digest({name:algo}, buf);

    // IE
    if(!buf.then) {
        buf = new Promise((resolve, reject) => {
            buf.oncomplete = (evt) => {
                resolve(evt.target.result);
            };
            buf.onerror = reject;
        });
    }
    return buf.then((buf) => new Uint8Array(buf));
}
