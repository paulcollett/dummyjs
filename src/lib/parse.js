import Dummy from './core'
import {rand, repeat, $$} from './utils'

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
  for (let i = 0; i < 3; i++) $$(`[${attr}]`)
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

parseDom.add('shorthand', (textAttr = 'data-dummy', repeatAttr = 'data-repeat', htmlAttr = 'data-html') => {
  // kitchen sink
  $$(`[${htmlAttr}]`).forEach(el => {
    const tags = el.getAttribute(htmlAttr);
    el.removeAttribute(htmlAttr);

    el.innerHTML += Dummy.html(tags);
  });

  // list support
  $$(`ul[${textAttr}], ol[${textAttr}]`).forEach(el => {
    el.removeAttribute(textAttr);

    el.innerHTML += Dummy.html('ul').replace(/<\/?ul>/g, ''); // generate li's
  });

  // select support
  $$(`select[${textAttr}]`).forEach(el => {
    el.removeAttribute(textAttr);

    el.innerHTML += Dummy.html('select').replace(/<\/?select>/g, '');
  });

  // table support
  $$(`table[${textAttr}]`).forEach(el => {
    el.removeAttribute(textAttr);

    el.innerHTML = Dummy.html('table').replace(/<\/?table>/g, '');
  });
});

parseDom.add('repeat', (attr = 'data-repeat') => {
  $$(`[${attr}]`)
  .sort((a, b) => a.compareDocumentPosition(b) & 2 ? -1 : 1)
  .forEach(el => {
    const amount = el.getAttribute(attr);
    el.outerHTML = repeat(el.outerHTML.replace(attr, attr + '-did'), rand(amount.split(',')[0], amount.split(',')[1]) || 4)
  });
});

parseDom.add('image', (attr = 'data-dummy') => {
  $$(`img[${attr}]`).forEach(el => {
    el.src = Dummy.src(el.getAttribute(attr), el);

    el.removeAttribute(attr);
  });
});

parseDom.add('text', (attr = 'data-dummy') => {
  const dummyTextEls = $$(`[${attr}]`);

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
  props.forEach(prop => $$(`[${attr}\\:${prop}]`).forEach(el => {
    el.setAttribute(prop, Dummy.text(el.getAttribute(`${attr}:${prop}`))); // set attribute used instead of prop to allow for data-psudo-el="sdfsdf"
    el.removeAttribute(`${attr}:${prop}`);
  }));
});

parseDom.add('tags', (tag = 'dummy') => {
  // tag support for text <dummy text="23"></dummy> & <dummy 23></dummy>
  $$(tag).forEach(el => {
    el.outerHTML = Dummy.text(el.attributes[0]
      ? el.attributes[0].value || (parseInt(el.attributes[0].name) ? el.attributes[0].name : '')
      : '');
  });
});

export default parseDom;
