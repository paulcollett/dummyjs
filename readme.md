
### Dummy.js – Crash test your front-end builds with:
#### Repeatable Elements, Dummy Text and Placeholder Images

![dummy.js](https://user-images.githubusercontent.com/1904774/31058166-1dade7b4-a6a4-11e7-8005-7c143fd3a60e.png)

Speed up and crash test your front-end builds and HTML prototypes with Dummy Text, Placeholder Images, Kitchen Sink elements and tools for easy duplicating and repeating of markup.

### 😎 Why

Going through the front-end creation process requires the frequent need to test with dynamic images and text of various sizes to battle test the html + css styling. This can be a time consuming manual step, but also a crucial one to simulating user generated content, testing word wrapping, repeating of elements, etc. To battle test the front end for these edge cases not only quicker, but more thoroughly, the first version of DummyJs was realized to add a layer of automation to this process.

From here DummyJS has extended to double as a robust tool in JS first development environments, like React and Vue and also Node JS.

_Latest documentation and examples can be found at:_
### https://dummyjs.com/


## 😄 Usage

Add the script tag to your HTML page:

```HTML
<script src="https://dummyjs.com/js"></script>
```
or for JS use in React and JS apps:

```
npm install dummyjs --save-dev
```
```JS
const Dummy = require('dummyjs'); // es5 or node
import Dummy from 'dummyjs'; // es6
```


## 📖 Dummy Text

```HTML
<p data-dummy></p>
```
```JS
Dummy.text()
```

Choose the amount of words:
```HTML
<p data-dummy="150"></p>
```
```JS
Dummy.text(150)
```

Choose a random amount of words between 3 and 10:
```HTML
<p data-dummy="3,10"></p>
```
```JS
Dummy.text(3,10)
```

## 🎨 Dummy Images
DummyJs Images are rendered client side so NO one can to log your data. It's secure for your piece of mind to keep your unreleased product secret

```HTML
<img data-dummy="400x300" />
```
```JS
Dummy.img(400,300)
```

Defaults to the size of the parent container
```HTML
<img data-dummy />
```

Random size
```HTML
<img data-dummy="400,100x100,400" />
```
```JS
Dummy.img('400,100x100,400')
```

Custom Text
```HTML
<img data-dummy="400x300" data-text="person" />
```

Custom Colors
```HTML
<img data-dummy="400x300" data-color="#0000ff" data-text-color="#fff" />
```


## Output a Kitchen Sick of HTML
Useful for quick Base styling or testing CMS outputted HTML. Tags like `ul`, `select`, `table`, `forms` and more are automatically outputted with suitable contents.

Output a kitchen sick of headings, tables, images & form elements
```HTML
<div data-html></div>
```
```JS
Dummy.html() // returns a string of html elements
```

Output a specific element:
```HTML
<div data-html="table"></div>
```
```JS
Dummy.html('table') // returns a string of html elements
```

Or, multiple elements:
```HTML
<div data-html="h1,table,form,ul,p"></div>
```
```JS
Dummy.html('h1,table,form,ul,p') // returns a string of html elements
```


## Repeat Elements

```HTML
<div data-repeat="3">Team Member</div>
```

Repeat a random amount of times between 3 and 10:
```HTML
<p data-repeat="3,10"></p>
```

## Copy Elements

Duplicate elements into other areas of your webpage. Pass a CSS selector like `.myelement` or `.post h3`

```HTML
<div data-copy=".pagination"></div>
```

## More Docs and Examples are available at:

**https://dummyjs.com/**

- Bootstrap examples https://dummyjs.com/docs/bootstrap.html
- Shh.. New features https://dummyjs.com/docs/undocumented.html

### Usage with jQuery and Vue
jQuery:
```JS
jQuery('p').dummy(30)
```

Vue.js:
https://www.npmjs.com/package/vue-dummy


Issues and suggestions:
https://github.com/paulcollett/dummyjs
