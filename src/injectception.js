/* eslint-env browser */


const getData = async function getData(postId, nonce) {
  const endpoint = `https://www.seattletimes.com/wp-json/wp/v2/posts/${postId}?context=edit&_wpnonce=${nonce}`;
  const res = await fetch(endpoint, { credentials: 'include' });
  return res.json();
};

const parse = function parse(soFar, node) {
  const children = Array.from(node.childNodes);
  if (children.length === 0) return soFar + node.textContent;

  const childContent = children.reduce(parse, '');
  switch (node.nodeName) {
    case 'H1': {
      return `${soFar}# ${childContent.trim()}`;
    }
    case 'H2': {
      return `${soFar}## ${childContent.trim()}`;
    }
    case 'H3': {
      return `${soFar}### ${childContent.trim()}`;
    }
    case 'H4': {
      return `${soFar}#### ${childContent.trim()}`;
    }
    default: {
      return `${soFar}${childContent}`;
    }
  }
};

const toMarkdown = function toMarkdown(input) {
  const doc = document.implementation.createHTMLDocument();
  doc.body.innerHTML = input;
  window.debugdoc = doc;
  return parse('', doc.body);
};

const main = async function main() {
  const { nonce } = window.wpApiSettings;
  const postId = window.location.href.match(/post=(\d+)/)[1];
  const data = await getData(postId, nonce);
  console.log(data.content.raw);
  const output = toMarkdown(data.content.raw);
  console.log(output);
};

main();
