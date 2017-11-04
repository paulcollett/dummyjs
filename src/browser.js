import Dummy from './lib/core.js'
import ParseDom from './lib/parse.js'

if(document && document.addEventListener) {
  if(window.dummy_auto !== false) {
    document.createElement('dummy'); // still needed for IE support?
    document.addEventListener('DOMContentLoaded', ParseDom.all);
  }

  // Expose parser and allows for selective parsing
  // eg. Dummy.parse.text('data-dummy')
  Dummy.parse = ParseDom.parsers;
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
