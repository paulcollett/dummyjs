var fs = require('fs');
var rollup = require('rollup');
var buble = require('rollup-plugin-buble');
var uglify = require('uglify-js');
var package = require('./package.json');
var banner =
    "/*!\n" +
    " * DummyJS v" + package.version + "\n" +
    " * http://dummyjs.com/\n" +
    " */\n";

rollup.rollup({
  input: 'src/browser.js',
  plugins: [buble()]
})
.then(bundle =>
  bundle.generate({
    format: 'umd',
    banner: banner,
    name: 'Dummy',
  }).then(({code}) => write('dist/dummy.js', code, bundle))
)
.then(bundle =>
  write('dist/dummy.min.js', banner + '\n' +
    uglify.minify(read('dist/dummy.js')).code,
  bundle)
);

rollup.rollup({
  input: 'src/module.js',
  plugins: [buble()]
})
.then(bundle =>
  bundle.generate({
    format: 'es',
  }).then(({code}) => write('dist/dummy.es2015.js', code, bundle))
)
.then(bundle =>
  bundle.generate({
    format: 'cjs',
  }).then(({code}) => write('dist/dummy.cjs.js', code, bundle))
);

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function write(dest, code, bundle) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err);
      console.log(blue(dest) + ' ' + getSize(code));
      resolve(bundle);
    });
  });
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
}
