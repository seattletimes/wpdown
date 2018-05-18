/* eslint-env browser */

const getData = async function getData(postId, nonce) {
  const endpoint = `https://www.seattletimes.com/wp-json/wp/v2/posts/${postId}?context=edit&_wpnonce=${nonce}`;
  const res = await fetch(endpoint, { credentials: 'include' });
  return res.json();
};

const main = async function main() {
  const { nonce } = window.wpApiSettings;
  const postId = window.location.href.match(/post=(\d+)/)[1];
  const data = await getData(postId, nonce);
  console.log(data.content.raw);
};

main();
