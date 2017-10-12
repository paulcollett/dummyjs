import Utils from './utils.js'

const text = (argString) => {
  let wordCount = (argString + '').split(',');
  wordCount = Utils.rand(wordCount[0], wordCount[1]) || 10;

  let lib = 'lorem ipsum dolor sit amet consectetur adipiscing elit nunc euismod vel ' +
    'dolor nec viverra nullam auctor enim condimentum odio laoreet libero ' +
    'libero tincidunt est sagittis curabitur vitae';

  if(wordCount > 3) lib += (' ' + 'a in id id at');

  const libRepeat = Math.ceil(wordCount/lib.split(' ').length);

  lib = Utils.repeat(lib, libRepeat).split(' ').sort(() => 0.5 - Math.random()).slice(0, wordCount).join(' ');

  return lib.charAt(0).toUpperCase() + lib.slice(1);
};

const src = (argString, el) => {
  let size = '404';

  if(argString) {
    size = argString;
  } else if(el) {
    size = [parseInt(el.getAttribute('width') || el.offsetWidth), parseInt(el.getAttribute('height') || el.offsetHeight)].filter((v) => {return !!v}).join('x');
    size =  size || (el.parentNode && el.parentNode.offsetWidth) || '404';
  }

  // split size to allow for random ranges
  size = (size + '').split('x').map((a)=> Utils.rand(a.split(',')[0], a.split(',')[1]));

  const w = size[0];
  const h = (size[1]||size[0]);
  const text = (el.getAttribute('data-text') || (w + '×' + h));
  const bgColor = (el.getAttribute('data-color') || '#ccc');
  const textColor = (el.getAttribute('data-text-color') || '#888');
  const fontSize = (w / 3.5 / (text.length * 0.3)) - text.length;

  return 'data:image/svg+xml,'
    + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+ w + 'px" height="' + h + 'px">'
    + '<rect x="0" y="0" width="100%" height="100%" fill="' + bgColor + '"/>'
    + '<line opacity="0.5" x1="0%" y1="0%" x2="100%" y2="100%" stroke="' + textColor + '" stroke-width="2" />'
    + '<line opacity="0.5" x1="100%" y1="0%" x2="0%" y2="100%" stroke="' + textColor + '" stroke-width="2" />'
    + '<text stroke="' + bgColor + '" stroke-width="2em" x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-size="'+fontSize+'">' + text + '</text>'
    + '<text fill="' + textColor + '" x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-size="'+fontSize+'" font-family="sans-serif">' + text + '</text>'
    + '</svg>');
}

export default {
  text: text,
  src: src
};
