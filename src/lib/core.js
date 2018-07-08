import {rand, repeat} from './utils'

const text = (...args) => {
  let wordCount = args.join(',').split(','); // allow for mixed argument input ie. ('20,30') or (20, 30)
  wordCount = rand(wordCount[0], wordCount[1]) || 10;

  let lib = 'lorem ipsum dolor sit amet consectetur adipiscing elit nunc euismod vel ' +
    'dolor nec viverra nullam auctor enim condimentum odio laoreet libero ' +
    'libero tincidunt est sagittis curabitur vitae';

  if(wordCount > 3) lib += (' ' + 'a in id id at');

  const libRepeat = Math.ceil(wordCount/lib.split(' ').length);

  lib = repeat(lib, libRepeat).split(' ').sort(() => 0.5 - Math.random()).slice(0, wordCount).join(' ');

  return lib.charAt(0).toUpperCase() + lib.slice(1);
};

const src = (...args) => {
  // allow for mixed argument input ie. (200, 200, el) ('200x200', el), ('200')
  const el = args[args.length - 1] instanceof HTMLImageElement ? args.pop() : null;
  let size = args.splice(0, 2).join('x');

  if(!size && el) {
    size = [parseInt(el.getAttribute('width') || el.offsetWidth), parseInt(el.getAttribute('height') || el.offsetHeight)].filter((v) => {return !!v}).join('x');
    size =  size || (el.parentNode && el.parentNode.offsetWidth);
  }

  // split size to allow for random ranges
  size = (size + '' || '404').split('x').map((a)=> rand(a.split(',')[0] || '404', a.split(',')[1]));

  const w = size[0];
  const h = size[1] || size[0];

  // Getting a little messy, but idea is to test next argument to see if it isn't a color (not #..) then remove it from the arguments list and return. Otherwise fallback..
  const text = args[0] && /^\w{2,}/.test(args[0]) ? args.splice(0, 1).pop() : ( el && el.getAttribute('data-text') || (w + '×' + h) );
  const bgColor = (el && el.getAttribute('data-color') || args[0] || '#ccc');
  const textColor = (el && el.getAttribute('data-text-color') || args[1] || '#888');

  // Better logic out there?
  const fontSize = (w / 3.5 / (text.length * 0.3)) - text.length;

  return 'data:image/svg+xml,'
    + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+ w + 'px" height="' + h + 'px">'
    + '<rect x="0" y="0" width="100%" height="100%" fill="' + bgColor + '"/>'
    + '<line opacity="0.5" x1="0%" y1="0%" x2="100%" y2="100%" stroke="' + textColor + '" stroke-width="2" />'
    + '<line opacity="0.5" x1="100%" y1="0%" x2="0%" y2="100%" stroke="' + textColor + '" stroke-width="2" />'
    + '<text stroke="' + bgColor + '" stroke-width="2em" x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-size="'+fontSize+'" font-family="sans-serif">' + text + '</text>'
    + '<text fill="' + textColor + '" x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-size="'+fontSize+'" font-family="sans-serif">' + text + '</text>'
    + '</svg>');
}

const table = (rows = 3, rowsTo = 6, cols = 3, colsTo = 6) => {
  cols = rand(cols, colsTo || cols);
  rows = rand(rows, rowsTo || rows);
  return `<table><thead><tr>`
    + repeat(() => `<th>${text(1,3)}</th>`, cols)
    + `</tr></thead><tbody>`
    + repeat(`<tr>${repeat(() => `<td>${text(3,10)}</td>`, cols)}</tr>`, rows)
    + `</tbody></table>`;
}

const html = usersTags => {
  let tags = usersTags ? String(usersTags).split(',') : 'h1,h2,h3,h4,h5,ul,ol,table,blockquote,img,form'.split(',').join(',p,').split(',');
  const liFn = () => repeat(() => `<li>${text(4, 10)}</li>`, rand(2, 5));

  const special = {
    a: () => `<a href="#">${text(2, 4)}</a>`,
    ul: () => `<ul>${liFn()}</ul>`,
    ol: ()=> `<ol>${liFn()}</ol>`,
    table: () => table(),
    img: () => `<img src="${src('400,1200x200,800')}" />`,
    select: () => `<select>${repeat(() => `<option>${text(2,4)}</option>`, 4, 10)}</select>`,
    p: () => `<p>${text(20, 50)}</p>`,
    button: () => `<button>${text(1, 4)}</button>`,
    input: () => `<input placeholder="${text(1,3)}" />`,
    form: () => `<form action="#">${html('label,input,label,select,button')}</form>`
  }

  tags = tags
    .map(tag => tag.trim().toLowerCase())
    .map(tag => special[tag] ? special[tag]() : `<${tag}>${text(5, 15)}</${tag}>`).join('');

  // few extra tags for default
  tags += usersTags ? '' :
    `<hr /><p>${text(1, 3)} <strong>bold text</strong>. ${text(1, 3)} <em>italic text</em>. ${text(1, 3)} <a href="#">a link</a>. ${text(150, 250)}</p>`
    + repeat(() => `<p>${text(50, 100)}</p>`, rand(1, 3));

  return tags;
}

// Undocumented but you could simply do:
// Dummy(123) instead of Dummy.text(123)
// or Dummy('100x100')
// or Dummy('table')
const expt = (...args) => {
  const fn = String(args[0]).indexOf('x') > 0 ? src : parseInt(args[0]) > 0 ? text : html;

  return fn(...args);
};
expt.t = expt.txt = expt.text = text;
expt.src = expt.image = expt.img = src;
expt.html = html;

export default expt;

