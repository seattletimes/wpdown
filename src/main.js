/* eslint-env browser */
/* global chrome */

import convert from './convert';

const currentTab = () => new Promise((resolve, reject) => {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    if (tabs.length === 1) resolve(tabs[0]);
    else reject(new Error(`Found ${tabs.length} active tabs.`));
  });
});

const getData = async function getData(postId, nonce) {
  const endpoint = `https://www.seattletimes.com/wp-json/wp/v2/posts/${postId}?context=edit&_wpnonce=${nonce}`;
  const res = await fetch(endpoint, { credentials: 'include' });
  return res.json();
};

const main = async function main() {
  const tab = await currentTab();
  chrome.tabs.executeScript(tab.id, { file: 'inject.js' });
  chrome.runtime.onMessage.addListener(async (nonce) => {
    const postId = tab.url.match(/post=(\d+)/)[1];
    const data = await getData(postId, nonce);
    const output = convert(data);
    // https://stackoverflow.com/questions/10701983/what-is-the-mime-type-for-markdown
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({ url, saveAs: true });
  });
};

chrome.browserAction.onClicked.addListener(main);
