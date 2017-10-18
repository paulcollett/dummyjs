import Dummy from './lib/core.js'
import Utils from './lib/utils.js'

const updateDom = function() {
  // copy element support
  for (let i = 0; i < 3; i++) Utils.arr(document.querySelectorAll('[data-copy]'))
    .sort((a, b) => a.compareDocumentPosition(b) & 2 ? 1 : -1) // inner first then parents
    .forEach(el => {
      const selector = el.getAttribute('data-copy');
      let elToCopy = document.querySelector(selector) || document.getElementById(selector) || document.getElementsByClassName(selector)[0];

      if(!elToCopy) {
        elToCopy = {outerHTML: `data-copy="${selector}" element not found`};
      }

      el.outerHTML = elToCopy[elToCopy.tagName == 'SCRIPT' || elToCopy.tagName == 'TEMPLATE' ? 'innerHTML' : 'outerHTML'];
  });

  // kitchen sink
  document.querySelectorAll('[data-dummy=sink]').forEach(el => {
    el.removeAttribute('data-dummy');

    let tags = 'h1,h2,h3,h4,h5,ul,ol,table,blockquote'.split(',').join(',p,').split(',');

    tags = tags.map(tag => `<${tag} data-dummy></${tag}>`).join('')
      + '<hr /><p data-dummy="150">This <strong>is a longer</strong> <em>paragraph</em> <a href="#">with a link</a>. </p>'
      + '<img data-dummy="800" /><p data-dummy="70" data-repeat=4></p>';

    el.innerHTML += tags;
  });

  // list support
  document.querySelectorAll('ul[data-dummy], ol[data-dummy]').forEach(el => {
    el.removeAttribute('data-dummy');

    el.innerHTML += Utils.repeat('<li data-dummy></li>', 4);
  });

  // select support
  document.querySelectorAll('select[data-dummy]').forEach(el => {
    el.removeAttribute('data-dummy');

    el.innerHTML += Utils.repeat('<option data-dummy=2,3></option>', 4);
  });

  // table support
  document.querySelectorAll('table[data-dummy]').forEach(el => {
    el.removeAttribute('data-dummy');

    el.innerHTML = `<thead><tr><th data-dummy=2 data-repeat=3></th></tr></thead>
      <tbody><tr data-repeat=3><td data-dummy=4 data-repeat=3></td></tr></tbody>`;
  });

  // repeater support
  Utils.arr(document.querySelectorAll('[data-repeat]'))
    .sort((a, b) => a.compareDocumentPosition(b) & 2 ? -1 : 1)
    .forEach(el => {
      const amount = el.getAttribute('data-repeat');
      el.outerHTML = Utils.repeat(el.outerHTML, Utils.rand(amount.split(',')[0], amount.split(',')[1]) || 4)
    });

  // image support
  document.querySelectorAll('img[data-dummy]').forEach(el => {
    el.src = Dummy.src(el.getAttribute('data-dummy'), el);

    el.removeAttribute('data-dummy');
  });

  const dummyTextEls = Utils.arr(document.querySelectorAll('[data-dummy]'));

  // prevent chromes latin translation prompt for pages with majority dummy text
  let meta = document.createElement('meta');
  meta.name = 'google';
  meta.content = 'notranslate';
  dummyTextEls.length && document.querySelector('head').appendChild(meta);

  // text support (works with inputs as well)
  dummyTextEls
    .sort((a, b) => a.compareDocumentPosition(b) & 2 ? -1 : 1) // needed?
    .forEach(el => {
      el[el.tagName === 'INPUT' ? 'value' : 'innerHTML'] += Dummy.text(el.getAttribute('data-dummy'));
    });

  // some props support
  const props = 'placeholder,title'.split(',');
  props.forEach(prop => document.querySelectorAll(`[data-dummy\\:${prop}]`).forEach(el => {
    el[prop] = Dummy.text(el.getAttribute(`data-dummy:${prop}`));
  }));

  // tag support for text <dummy text="23"></dummy> & <dummy 23></dummy>
  document.querySelectorAll('dummy').forEach(el => {
    el.outerHTML = Dummy.text(el.attributes[0]
      ? el.attributes[0].value || (parseInt(el.attributes[0].name) ? el.attributes[0].name : '')
      : '');
  });
};

if(document && document.addEventListener) {
  if(window.dummy_auto !== false) {
    document.createElement('dummy');
    document.addEventListener('DOMContentLoaded', updateDom);
  }

  Dummy.updateDom = updateDom;
}

if(window && window.jQuery) {
  window.jQuery.fn.dummy = function() {
    const args = [].slice.call(arguments);

    window.jQuery(this).each(function() {
      this.nodeName.toLowerCase() === 'img'
        ? this.src = Dummy.src.apply(null, args.concat(this))
        : this.innerHTML = Dummy.text.apply(null, args);
    });
  }
}

export default Dummy;
