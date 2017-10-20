import Dummy from './core.js'
import Utils from './utils.js'

const parseDom = (function () {
  const parseOrder = [];
  const parsers = {};

  return {
    parsers: parsers,
    add: function(name, fn) {
      parsers[name] = fn;
      parseOrder.push(name);
    },
    all: function(opts = {}) {
      parseOrder.forEach(name => parsers[name]());
    }
  };
})();

parseDom.add('copy', (attr = 'data-copy') => {
  for (let i = 0; i < 3; i++) Utils.arr(document.querySelectorAll(`[${attr}]`))
  .sort((a, b) => a.compareDocumentPosition(b) & 2 ? 1 : -1) // inner first then parents
  .forEach(el => {
    const selector = el.getAttribute(attr);
    let elToCopy = document.querySelector(selector) || document.getElementById(selector) || document.getElementsByClassName(selector)[0];

    if(!elToCopy) {
      elToCopy = {outerHTML: `${attr}="${selector}" element not found`};
    }

    el.outerHTML = elToCopy[elToCopy.tagName == 'SCRIPT' || elToCopy.tagName == 'TEMPLATE' ? 'innerHTML' : 'outerHTML'];
  });
});

parseDom.add('shorthand', (textAttr = 'data-dummy', repeatAttr = 'data-repeat') => {
  // kitchen sink
  document.querySelectorAll(`[${textAttr}=sink]`).forEach(el => {
    el.removeAttribute(textAttr);

    let tags = 'h1,h2,h3,h4,h5,ul,ol,table,blockquote'.split(',').join(',p,').split(',');

    tags = tags.map(tag => `<${tag} ${textAttr}></${tag}>`).join('')
      + `<hr /><p ${textAttr}="150">This <strong>is a longer</strong> <em>paragraph</em> <a href="#">with a link</a>. </p>`
      + `<img ${textAttr}="800" /><p ${textAttr}="70" ${repeatAttr}=4></p>`;

    el.innerHTML += tags;
  });

  // list support
  document.querySelectorAll(`ul[${textAttr}], ol[${textAttr}]`).forEach(el => {
    el.removeAttribute(textAttr);

    el.innerHTML += Utils.repeat(`<li ${textAttr}></li>`, 4);
  });

  // select support
  document.querySelectorAll(`select[${textAttr}]`).forEach(el => {
    el.removeAttribute(textAttr);

    el.innerHTML += Utils.repeat(`<option ${textAttr}=2,3></option>`, 4);
  });

  // table support
  document.querySelectorAll(`table[${textAttr}]`).forEach(el => {
    el.removeAttribute(textAttr);

    el.innerHTML = `<thead><tr><th ${textAttr}=2 ${repeatAttr}=3></th></tr></thead>
      <tbody><tr ${repeatAttr}=3><td ${textAttr}=4 ${repeatAttr}=3></td></tr></tbody>`;
  });
});

parseDom.add('repeat', (attr = 'data-repeat') => {
  Utils.arr(document.querySelectorAll(`[${attr}]`))
  .sort((a, b) => a.compareDocumentPosition(b) & 2 ? -1 : 1)
  .forEach(el => {
    const amount = el.getAttribute(attr);
    el.outerHTML = Utils.repeat(el.outerHTML.replace(attr, attr + '-did'), Utils.rand(amount.split(',')[0], amount.split(',')[1]) || 4)
  });
});

parseDom.add('image', (attr = 'data-dummy') => {
  document.querySelectorAll(`img[${attr}]`).forEach(el => {
    el.src = Dummy.src(el.getAttribute(attr), el);

    el.removeAttribute(attr);
  });
});

parseDom.add('text', (attr = 'data-dummy') => {
  const dummyTextEls = Utils.arr(document.querySelectorAll(`[${attr}]`));

  // prevent chromes latin translation prompt for pages with majority dummy text
  let meta = document.createElement('meta');
  meta.name = 'google';
  meta.content = 'notranslate';
  dummyTextEls.length && document.querySelector('head').appendChild(meta);

  // text support (works with inputs as well)
  dummyTextEls
    .sort((a, b) => a.compareDocumentPosition(b) & 2 ? -1 : 1) // needed?
    .forEach(el => {
      el[el.tagName === 'INPUT' ? 'value' : 'innerHTML'] += Dummy.text(el.getAttribute(attr));
      el.removeAttribute(attr);
    });
});

parseDom.add('props', (attr = 'data-dummy') => {
  // eg. data-dummy:placeholder or data-dummy:title
  const props = (document.body.innerHTML.match(new RegExp(`${attr}\:([a-zA-Z\-]+)`, 'g'))||[]).map(e => e.replace(`${attr}:`,''));
  props.forEach(prop => document.querySelectorAll(`[${attr}\\:${prop}]`).forEach(el => {
    el.setAttribute(prop, Dummy.text(el.getAttribute(`${attr}:${prop}`))); // set attribute used instead of prop to allow for data-psudo-el="sdfsdf"
    el.removeAttribute(`${attr}:${prop}`);
  }));
});

parseDom.add('tags', (tag = 'dummy') => {
  // tag support for text <dummy text="23"></dummy> & <dummy 23></dummy>
  document.querySelectorAll(tag).forEach(el => {
    el.outerHTML = Dummy.text(el.attributes[0]
      ? el.attributes[0].value || (parseInt(el.attributes[0].name) ? el.attributes[0].name : '')
      : '');
  });
});

export default parseDom;
