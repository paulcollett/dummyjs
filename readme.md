
### Dummy.js – Crash test your front-end builds, with:
#### repeatable elements, dummy text & placeholder images

![dummy.js](https://user-images.githubusercontent.com/1904774/31058166-1dade7b4-a6a4-11e7-8005-7c143fd3a60e.png)

Dummy.js is simple drop in script that provides tools in helping build your front-end HTML & CSS.

_Latest documentation & Examples at:_
### https://dummyjs.com/


## Usage

Add to your HTML page:

`<script src="https://dummyjs.com/dummy.js"></script>`

## Dummy Text

`<p data-dummy></p>`

Choose the amount of words:
`<p data-dummy="150"></p>`

Render dummy markup for `ol` `ul` `table`:
`<table data-dummy></table>`

Choose random amount of words between 3 & 10:
`<p data-dummy="3,10"></p>`

## Dummy Images

`<img data-dummy="400x300" />`

Defaults to the size of the parent container
`<img data-dummy />`

Custom Text
`<img data-dummy="400x300" data-text="person" />`

Custom Colors
`<img data-dummy="400x300" data-color="#0000ff" data-text-color="#fff" />`

## Repeat Elements

`<div data-repeat="3">Team Member</div>`

Repeat random amount between 3 & 10:
`<p data-repeat="3,10"></p>`

## Kitchen Sink

Output all the common tags inc. headings, paragraphs etc. Great for base styling

`<div data-dummy="sink"></div>`

## Copy Elements

Duplicate elements into other areas on your webpage. Pass a CSS selector like `.myelement` or `.post h3`

`<div data-copy=".pagination"></div>`

## More Docs & Examples:

https://dummyjs.com/

Vue.js Support:
https://www.npmjs.com/package/vue-dummy
