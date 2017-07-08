document.addEventListener('DOMContentLoaded', () => {
  const rand = function(min, max) {
    if(!min || !max) return min;
    min = Math.floor(min);
    max = Math.floor(max) + 1;
    return Math.floor(Math.random() * (max - min)) + min;
  };

  // copy element support
  for (let i = 0; i < 3; i++) Array.from(document.querySelectorAll('[data-copy]'))
    .sort((a, b) => a.compareDocumentPosition(b) & 2 ? 1 : -1) // inner first then parents
    .forEach(el => {
      const selector = el.getAttribute('data-copy');
      let elToCopy = document.querySelector(selector) || document.getElementById(selector) || document.getElementsByClassName(selector)[0];
      
      if(!elToCopy) {
        elToCopy = {outerHTML: 'data-copy="' + selector + '" element not found'};
      }

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
    const providedImageSize = [parseInt(el.getAttribute('width') || el.offsetWidth), parseInt(el.getAttribute('height') || el.offsetHeight)].filter((v) => {return !!v}).join('x');
    let size = '' + (el.getAttribute('data-dummy') || providedImageSize || el.parentNode.offsetWidth || '404');
    
    // split size to allow for random ranges
    size = size.split('x').map((a)=>
      Math.min(rand(a.split(',')[0], a.split(',')[1]), 3999) // placehold caps size at 3999
    ).join('x');

    el.src = 'https://via.placeholder.com/' + size
      + '/' + (el.getAttribute('data-color') || 'ccc')
      + '/' + (el.getAttribute('data-text-color') || '888')
      + (el.getAttribute('data-text') && '?text=' + encodeURI(el.getAttribute('data-text')) || '');

    el.removeAttribute('data-dummy');
  });

  const dummyTextEls = Array.from(document.querySelectorAll('[data-dummy]'));

  // prevent page translation to latin containing majority dummy text
  let meta = document.createElement('meta');
  meta.name = 'google';
  meta.content = 'notranslate';
  dummyTextEls.length && document.querySelector('head').appendChild(meta);

  // text support
  dummyTextEls
    .sort((a, b) => a.compareDocumentPosition(b) & 2 ? -1 : 1)
    .forEach(el => {

    let wordCount = el.getAttribute('data-dummy').split(',');
    wordCount = rand(wordCount[0], wordCount[1]) || 10;

    let lib = window.DUMMYJS_WORDS || 'lorem ipsum dolor sit amet consectetur adipiscing elit nunc euismod vel ' +
      'dolor nec viverra nullam auctor enim condimentum odio laoreet libero ' +
      'libero tincidunt est sagittis curabitur vitae';
    
    if(wordCount > 3) lib += (' ' + (window.DUMMYJS_SHORT_WORDS || 'a in id id at'));

    const libRepeat = Math.ceil(wordCount/lib.split(' ').length);

    lib = lib.repeat(libRepeat).split(' ').sort(() => 0.5 - Math.random()).slice(0, wordCount).join(' ');

    el.innerHTML += lib.charAt(0).toUpperCase() + lib.slice(1);
  });
}, false);
