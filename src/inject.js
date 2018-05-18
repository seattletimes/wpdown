/* global chrome, document */

// adapted from https://gist.github.com/nok/a98c7c5ce0d0803b42da50c4b901ef84
// This script has access to 'document' but not 'window'
// so we inject another script directly into the DOM to get the wp api nonce
const script = document.createElement('script');
script.setAttribute('src', chrome.extension.getURL('injectception.js'));
document.body.appendChild(script);
