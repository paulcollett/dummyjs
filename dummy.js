/*!
 * DummyJS v1.0.2
 * http://dummyjs.com/
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Dummy = factory());
}(this, (function () { 'use strict';

var rand = function (min, max) {
  if(!min || !max) { return min; }
  min = Math.floor(min);
  max = Math.floor(max) + 1;
  return Math.floor(Math.random() * (max - min)) + min;
};

// repeat polyfill
var repeat = function (str, count) {
  return ''.repeat ? ('' + str).repeat(count) : (function (str, count, rpt) {
    for (var i = 0; i < count; i++) { rpt += str; }

    return rpt;
  })(str + '', Math.floor(count), '');
};

// array.from polyfill (!IE)
var arr = function (nodelist) {
  return Array.from ? Array.from(nodelist) : Array.prototype.slice.call(nodelist);
};

var Utils = {rand: rand, repeat: repeat, arr: arr};

var text = function () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  var wordCount = args.join(',').split(','); // allow for mixed argument input ie. ('20,30') or (20, 30)
  wordCount = Utils.rand(wordCount[0], wordCount[1]) || 10;

  var lib = 'lorem ipsum dolor sit amet consectetur adipiscing elit nunc euismod vel ' +
    'dolor nec viverra nullam auctor enim condimentum odio laoreet libero ' +
    'libero tincidunt est sagittis curabitur vitae';

  if(wordCount > 3) { lib += (' ' + 'a in id id at'); }

  var libRepeat = Math.ceil(wordCount/lib.split(' ').length);

  lib = Utils.repeat(lib, libRepeat).split(' ').sort(function () { return 0.5 - Math.random(); }).slice(0, wordCount).join(' ');

  return lib.charAt(0).toUpperCase() + lib.slice(1);
};

var src = function () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  // allow for mixed argument input ie. (200, 200, el) ('200x200', el), ('200')
  var el = args[args.length - 1] instanceof HTMLImageElement ? args.pop() : null;
  var size = args.splice(0, 2).join('x');

  if(!size && el) {
    size = [parseInt(el.getAttribute('width') || el.offsetWidth), parseInt(el.getAttribute('height') || el.offsetHeight)].filter(function (v) {return !!v}).join('x');
    size =  size || (el.parentNode && el.parentNode.offsetWidth);
  }

  // split size to allow for random ranges
  size = (size + '' || '404').split('x').map(function (a){ return Utils.rand(a.split(',')[0] || '404', a.split(',')[1]); });

  var w = size[0];
  var h = size[1] || size[0];

  // Getting a little messy, but idea is to test next argument to see if it isn't a color (not #..) then remove it from the arguements list and return. Otherwise fallback..
  var text = args[0] && /^\w{2,}/.test(args[0]) ? args.splice(0, 1).pop() : ( el && el.getAttribute('data-text') || (w + '×' + h) );
  var bgColor = (el && el.getAttribute('data-color') || args[0] || '#ccc');
  var textColor = (el && el.getAttribute('data-text-color') || args[1] || '#888');

  // Better logic out there?
  var fontSize = (w / 3.5 / (text.length * 0.3)) - text.length;

  return 'data:image/svg+xml,'
    + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+ w + 'px" height="' + h + 'px">'
    + '<rect x="0" y="0" width="100%" height="100%" fill="' + bgColor + '"/>'
    + '<line opacity="0.5" x1="0%" y1="0%" x2="100%" y2="100%" stroke="' + textColor + '" stroke-width="2" />'
    + '<line opacity="0.5" x1="100%" y1="0%" x2="0%" y2="100%" stroke="' + textColor + '" stroke-width="2" />'
    + '<text stroke="' + bgColor + '" stroke-width="2em" x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-size="'+fontSize+'">' + text + '</text>'
    + '<text fill="' + textColor + '" x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-size="'+fontSize+'" font-family="sans-serif">' + text + '</text>'
    + '</svg>');
};

var Dummy$1 = {
  text: text,
  src: src
};

var updateDom = function() {
  // copy element support
  for (var i = 0; i < 3; i++) { Utils.arr(document.querySelectorAll('[data-copy]'))
    .sort(function (a, b) { return a.compareDocumentPosition(b) & 2 ? 1 : -1; }) // inner first then parents
    .forEach(function (el) {
      var selector = el.getAttribute('data-copy');
      var elToCopy = document.querySelector(selector) || document.getElementById(selector) || document.getElementsByClassName(selector)[0];

      if(!elToCopy) {
        elToCopy = {outerHTML: ("data-copy=\"" + selector + "\" element not found")};
      }

      el.outerHTML = elToCopy[elToCopy.tagName == 'SCRIPT' || elToCopy.tagName == 'TEMPLATE' ? 'innerHTML' : 'outerHTML'];
  }); }

  // kitchen sink
  document.querySelectorAll('[data-dummy=sink]').forEach(function (el) {
    el.removeAttribute('data-dummy');

    var tags = 'h1,h2,h3,h4,h5,ul,ol,table,blockquote'.split(',').join(',p,').split(',');

    tags = tags.map(function (tag) { return ("<" + tag + " data-dummy></" + tag + ">"); }).join('')
      + '<hr /><p data-dummy="150">This <strong>is a longer</strong> <em>paragraph</em> <a href="#">with a link</a>. </p>'
      + '<img data-dummy="800" /><p data-dummy="70" data-repeat=4></p>';

    el.innerHTML += tags;
  });

  // list support
  document.querySelectorAll('ul[data-dummy], ol[data-dummy]').forEach(function (el) {
    el.removeAttribute('data-dummy');

    el.innerHTML += Utils.repeat('<li data-dummy></li>', 4);
  });

  // select support
  document.querySelectorAll('select[data-dummy]').forEach(function (el) {
    el.removeAttribute('data-dummy');

    el.innerHTML += Utils.repeat('<option data-dummy=2,3></option>', 4);
  });

  // table support
  document.querySelectorAll('table[data-dummy]').forEach(function (el) {
    el.removeAttribute('data-dummy');

    el.innerHTML = "<thead><tr><th data-dummy=2 data-repeat=3></th></tr></thead>\n      <tbody><tr data-repeat=3><td data-dummy=4 data-repeat=3></td></tr></tbody>";
  });

  // repeater support
  Utils.arr(document.querySelectorAll('[data-repeat]'))
    .sort(function (a, b) { return a.compareDocumentPosition(b) & 2 ? -1 : 1; })
    .forEach(function (el) {
      var amount = el.getAttribute('data-repeat');
      el.outerHTML = Utils.repeat(el.outerHTML, Utils.rand(amount.split(',')[0], amount.split(',')[1]) || 4);
    });

  // image support
  document.querySelectorAll('img[data-dummy]').forEach(function (el) {
    el.src = Dummy$1.src(el.getAttribute('data-dummy'), el);

    el.removeAttribute('data-dummy');
  });

  var dummyTextEls = Utils.arr(document.querySelectorAll('[data-dummy]'));

  // prevent chromes latin translation prompt for pages with majority dummy text
  var meta = document.createElement('meta');
  meta.name = 'google';
  meta.content = 'notranslate';
  dummyTextEls.length && document.querySelector('head').appendChild(meta);

  // text support (works with inputs as well)
  dummyTextEls
    .sort(function (a, b) { return a.compareDocumentPosition(b) & 2 ? -1 : 1; }) // needed?
    .forEach(function (el) {
      el[el.tagName === 'INPUT' ? 'value' : 'innerHTML'] += Dummy$1.text(el.getAttribute('data-dummy'));
    });

  // some props support
  var props = 'placeholder,title'.split(',');
  props.forEach(function (prop) { return document.querySelectorAll(("[data-dummy\\:" + prop + "]")).forEach(function (el) {
    el[prop] = Dummy$1.text(el.getAttribute(("data-dummy:" + prop)));
  }); });

  // tag support for text <dummy text="23"></dummy> & <dummy 23></dummy>
  document.querySelectorAll('dummy').forEach(function (el) {
    el.outerHTML = Dummy$1.text(el.attributes[0]
      ? el.attributes[0].value || (parseInt(el.attributes[0].name) ? el.attributes[0].name : '')
      : '');
  });
};

if(document && document.addEventListener) {
  if(window.dummy_auto !== false) {
    document.createElement('dummy');
    document.addEventListener('DOMContentLoaded', updateDom);
  }

  Dummy$1.updateDom = updateDom;
}

if(window && window.jQuery) {
  window.jQuery.fn.dummy = function() {
    var args = [].slice.call(arguments);

    window.jQuery(this).each(function() {
      this.nodeName.toLowerCase() === 'img'
        ? this.src = Dummy$1.src.apply(null, args.concat(this))
        : this.innerHTML = Dummy$1.text.apply(null, args);
    });
  };
}

return Dummy$1;

})));
