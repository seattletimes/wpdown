(async function() {
  var mod = await import('https://unpkg.com/turndown@4.0.2/lib/turndown.browser.es.js');
  var TurndownService = mod.default;
  var t = new TurndownService({
    headingStyle: 'atx',
  });
  var html = document.querySelector('iframe#content_ifr').contentWindow.document.body.innerHTML;
  var md = t.turndown(html);

  var background = document.createElement('div');
  background.style.position = 'absolute';
  background.style.top = 0;
  background.style.left = 0;
  background.style.bottom = 0;
  background.style.right = 0;
  background.style.background = 'rgba(0,0,0,0.8)';
  background.style['z-index'] = 999999999;
  document.body.append(background);

  var result = document.createElement('textarea');
  result.innerHTML = `${md}`;
  result.style.position = 'absolute';
  result.style.top = '20%';
  result.style.left = '20%';
  result.style.background = 'white';
  result.style.width = '60%';
  result.style.height = '60%';
  result.style['z-index'] = 999999999;
  background.append(result);
})();
