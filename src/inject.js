/* eslint-env browser */
/* global chrome */

// adapted from https://gist.github.com/nok/a98c7c5ce0d0803b42da50c4b901ef84
// This script has access to 'document' but not everything on 'window'
// so we inject another script directly into the DOM to get the wp api nonce
const script = document.createElement('script');
script.setAttribute('src', chrome.extension.getURL('injectception.js'));

const receiveNonce = function receiveNonce(ev) {
  if (ev.source !== window || !ev.data.wpdownNonce) return;

  // Relay message to main.js
  chrome.runtime.sendMessage(ev.data.wpdownNonce);

  // Cleanup after self
  window.removeEventListener('message', receiveNonce);
  document.body.removeChild(script);
};

window.addEventListener('message', receiveNonce);
document.body.appendChild(script);
