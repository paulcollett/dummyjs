document.addEventListener('DOMContentLoaded', () => {
  // copy element support
  // todo: external file support
  // todo: merge attributes
  Array.from(document.querySelectorAll('[data-copy]'))
    .sort((a, b) => a.compareDocumentPosition(b) & 2 ? 1 : -1) // inner first then parents
    .forEach(el => {
      const selector = el.getAttribute('data-copy');
      const elToCopy = document.querySelector(selector) || document.getElementById(selector) || document.getElementsByClassName(selector)[0];
      if(!elToCopy) {
        elToCopy = {outerHTML: '("' + selector + '" element not found in data-copy)'};
      }
      console.dir(elToCopy);
      el.outerHTML = (elToCopy.tagName == 'SCRIPT' || elToCopy.tagName == 'TEMPLATE') ? elToCopy.innerHTML : elToCopy.outerHTML;
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

    el.innerHTML += '<li data-dummy></li>'.repeat(4);
  });

  // table support
  document.querySelectorAll('table[data-dummy]').forEach(el => {
    el.removeAttribute('data-dummy');

    el.innerHTML = `<thead><tr><th data-dummy=2 data-repeat=3><th></tr></thead>
      <tbody><tr data-repeat=3><td data-dummy=4 data-repeat=3></td></tr></tbody>`;
  });

  // repeater support
  Array.from(document.querySelectorAll('[data-repeat]'))
    .sort((a, b) => a.compareDocumentPosition(b) & 2 ? -1 : 1)
    .forEach(el => {
      el.outerHTML = el.outerHTML.repeat(+el.getAttribute('data-repeat') || 4)
  });

  // image support
  document.querySelectorAll('img[data-dummy]').forEach(el => {
    const providedImageSize = [parseInt(el.getAttribute('width') || el.offsetWidth),parseInt(el.getAttribute('height') || el.offsetHeight)].filter((v) => {return !!v}).join('x');
    const size = '' + (el.getAttribute('data-dummy') || providedImageSize || el.parentNode.offsetWidth || '404');

    if(el.getAttribute('data-picture') && parseInt(size) <= 1280) { // loremflickr caps size at 1280
      el.src = 'https://loremflickr.com/'
        + (size.indexOf('x') > 0 ? size.replace('x', '/') : (size + '/' + size))
        + '/' + encodeURI(el.getAttribute('data-picture')) + '/all' + '?' + (+new Date());
    } else {
      el.src = 'https://via.placeholder.com/'
        + (parseInt(size) >= 4000 ? 3999 : size) // placehold caps size at 3999
        + '/' + (el.getAttribute('data-color') || 'ccc')
        + '/' + (el.getAttribute('data-text-color') || '888')
        + (el.getAttribute('data-text') && '?text=' + encodeURI(el.getAttribute('data-text')) || '');
    }

    el.removeAttribute('data-dummy');
  });

  // text support
  Array.from(document.querySelectorAll('[data-dummy]'))
    .sort((a, b) => a.compareDocumentPosition(b) & 2 ? -1 : 1)
    .forEach(el => {

    let wordCount = el.getAttribute('data-dummy').split(',');

    if(+wordCount[0] && +wordCount[1]) {
      // word count range data-dummy="5,20"
      const min = Math.floor(wordCount[0]);
      const max = Math.floor(wordCount[1]) + 1;
      wordCount = Math.floor(Math.random() * (max - min)) + min;
    } else {
      wordCount = Math.floor(wordCount[0]) || 10;
    }

    let lib = 'lorem ipsum dolor sit amet consectetur adipiscing elit nunc euismod vel ' +
      'dolor nec viverra nullam at auctor enim id condimentum odio in laoreet libero ' +
      'libero a tincidunt est sagittis id curabitur vitae';

    const libRepeat = Math.ceil(wordCount/lib.split(' ').length);

    lib = lib.repeat(libRepeat).split(' ').sort(() => 0.5 - Math.random()).slice(0, wordCount).join(' ');

    el.innerHTML += lib.charAt(0).toUpperCase() + lib.slice(1);
  });
}, false);
