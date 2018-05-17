chrome.browserAction.onClicked.addListener(() => {
  console.log('hi');
  chrome.tabs.query({ active: true }, async (tabs) => {
    const [tab] = tabs;
    const res = await fetch(tab.url, {
      credentials: 'include',
    });
    const src = await res.text();
    console.log(src);
  })
});
