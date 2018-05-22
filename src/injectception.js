/* eslint-env browser */

const getData = async function getData(postId, nonce) {
  const endpoint = `https://www.seattletimes.com/wp-json/wp/v2/posts/${postId}?context=edit&_wpnonce=${nonce}`;
  const res = await fetch(endpoint, { credentials: 'include' });
  return res.json();
};

const openTag = function openTag(node) {
  const endOpen = node.outerHTML.indexOf('>');
  return node.outerHTML.slice(0, endOpen + 1);
};

const closeTag = function closeTag(node) {
  // Not every node has a close tag
  if (node.innerHTML === '') return '';

  const startClose = node.outerHTML.lastIndexOf('<');
  return node.outerHTML.slice(startClose);
};

const removeShortcodes = function removeShortcodes(str) {
  return str.replace(/\[.*?\]/g, '');
};

const removeLinebreaks = function removeLinebreaks(str) {
  return str.replace(/\r?\n|\r/g, ' '); // https://stackoverflow.com/a/10805292
};

const cleanWhitespace = function cleanWhitespace(str) {
  return str.split('\n')
    .map(text => text.trim())
    .filter(text => text.length > 0)
    .join('\n\n');
};

const format = {
  IMG: n => `![${n.getAttribute('alt') || 'TK'}](${n.getAttribute('src')})`,
  BODY: (n, cc) => cc,
  H1: (n, cc) => `# ${removeLinebreaks(cc)}`,
  H2: (n, cc) => `## ${removeLinebreaks(cc)}`,
  H3: (n, cc) => `### ${removeLinebreaks(cc)}`,
  H4: (n, cc) => `#### ${removeLinebreaks(cc)}`,
  A: (n, cc) => `[${cc}](${n.getAttribute('href') || 'TK'})`,
  I: (n, cc) => `*${cc}*`,
  EM: (n, cc) => `*${cc}*`,
  B: (n, cc) => `**${cc}**`,
  STRONG: (n, cc) => `**${cc}**`,
  // Wordpress API doesn't usually give paragraphs
  // usually just split by linebreaks like Markdown
  // But I saw at least one case where it did have <p> nodes (Associated Press import)
  // Only putting one line break on each side,
  // with the assumption there will be more <p>s on either side (generally)
  P: (n, cc) => `\n\n${cc}`,
};

const parse = function parse(soFar, node) {
  // Case 1: text node leaf
  if (node.nodeName === '#text') return soFar + node.textContent;

  const children = Array.from(node.childNodes);
  if (children.length === 0) {
    // Case 2: non-text node leaf + we have a formatter (e.g. <img>)
    if (format[node.nodeName]) return soFar + format[node.nodeName](node);

    // Case 3: non-text node leaf + we don't have a formatter (e.g. <input>)
    return soFar + node.outerHTML;
  }

  // Parse children --> html string
  const childContent = children.reduce(parse, '');

  // Case 4: non-leaf + we have a formatter for it
  if (format[node.nodeName]) return soFar + format[node.nodeName](node, childContent);

  // Case 5: non-leaf + we don't have a formatter for it
  return soFar + openTag(node) + childContent + closeTag(node);
};

const toMarkdown = function toMarkdown(input) {
  const doc = document.implementation.createHTMLDocument();
  doc.body.innerHTML = removeShortcodes(input);
  const result = parse('', doc.body);
  return cleanWhitespace(result);
};

const addTopBottom = function addTopBottom(data, body) {
  return `# ${data.title.raw.trim() || 'HEADLINE TK'}

By ${data.st_authors.join(' and ') || 'BYLINE TK'}

${data.st_credit.trim() || 'CREDIT TK'}

${body}

*${data.st_tagline.trim() || 'TAGLINE TK'}*`;
};

const main = async function main() {
  const { nonce } = window.wpApiSettings;
  const postId = window.location.href.match(/post=(\d+)/)[1];
  const data = await getData(postId, nonce);
  console.log(data);
  const body = toMarkdown(data.content.raw);
  const output = addTopBottom(data, body);
  console.log(output);
};

main();
