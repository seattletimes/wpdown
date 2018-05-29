/* eslint-env browser */

const { nonce } = window.wpApiSettings;
const exfiltrator = document.getElementById('wpdown-exfiltrator');
exfiltrator.value = nonce;
const ev = new Event('exfiltrate');
exfiltrator.dispatchEvent(ev);
