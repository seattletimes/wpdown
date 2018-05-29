/* eslint-env browser */
/* global chrome */

import convert from './convert';

const removeDeclarativeRules = () => new Promise((resolve) => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => resolve());
});

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

// Set which pages to enable extension button (only Wordpress post pages)
chrome.runtime.onInstalled.addListener(async () => {
  await removeDeclarativeRules();
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { originAndPathMatches: 'https://www.seattletimes.com/wp-admin/post.php' },
    })],
    actions: [new chrome.declarativeContent.ShowPageAction()],
  }]);
});

// Inject script (to get nonce) if you click button on matching page
chrome.pageAction.onClicked.addListener(() => {
  chrome.tabs.executeScript({ file: 'inject.js' });
});

// When injected script sends nonce, do the processing
chrome.runtime.onMessage.addListener(async (nonce) => {
  const tab = await currentTab();
  const postId = tab.url.match(/post=(\d+)/)[1];
  const data = await getData(postId, nonce);
  const output = convert(data);
  // https://stackoverflow.com/questions/10701983/what-is-the-mime-type-for-markdown
  const blob = new Blob([output], { type: 'text/markdown; charset=UTF-8' });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({
    url,
    saveAs: true,
    filename: `${data.title.raw.trim().toLowerCase().replace(/\W+/g, '-')}.md`,
  });
});
