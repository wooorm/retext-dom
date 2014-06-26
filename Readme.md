# retext-dom [![Build Status](https://travis-ci.org/wooorm/retext-dom.svg?branch=master)](https://travis-ci.org/wooorm/retext-dom) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-dom.svg)](https://coveralls.io/r/wooorm/retext-dom?branch=master)

[![browser support](https://ci.testling.com/wooorm/retext-dom.png) ](https://ci.testling.com/wooorm/retext-dom)

---

Create a (living) DOM tree from a TextOM tree with **[Retext](https://github.com/wooorm/retext)**. Living? Well, when the TextOM tree changes, so will the DOM tree.

Notes:

- retext-dom only works in the browser (d’oh), or with a Node.js DOM such as [jsdom](https://www.npmjs.org/package/jsdom).
- the plugin automagically links the DOM nodes together, but only if they are attached to a document created using `Retext#parse()`

## Installation

NPM:
```sh
$ npm install retext-dom
```

Component.js:
```sh
$ component install wooorm/retext-dom
```

## Usage

```js
var Retext = require('retext'),
    DOM = require('retext-dom'),
    root;

root = new Retext()
    .use(DOM)
    .parse('Some English words.');

tree.toDOMNode().outerHTML;
/*
 * '<div>' +
 *     '<p>' +
 *         '<span>' +
 *             '<span>Some</span>' +
 *             '<span> </span>' +
 *             '<span>English</span>' +
 *             '<span> </span>' +
 *             '<span>words</span>' +
 *             '<span>.</span>' +
 *         '</span>' +
 *     '</p>'
 * '</div>'
 */

var $elementNode = document.querySelector('some-dom-node');

/* Append the node belonging to the TextOM tree to the DOM */
$elementNode.appendChild(tree.toDOMNode());

/* Log the clicked TextOM node */
$elementNode.addEventListener('click', function (event) {
    /* The DOM elements belonging to TextOM all have a `TextOMNode`
     * property referencing back to the TextOM tree */
    if (event.target.TextOMNode) {
        console.log(event.target.TextOMNode);
    }
});
```

## API

### TextOM.Node#toDOMNode()
```js
root.toDOMNode() // <div>...</div>
root.head.toDOMNode() // <p>...</p>
root.head.head.toDOMNode() // <span>...</span>
root.head.head.head.toDOMNode() // <span>Some</span>
```

Returns the DOM node belonging to the TextOM node.

Which tag?
- `ParagraphNode`'s create a `<p>` element;
- `RootNode`s create a `<div>` element;
- All other TextOM nodes create a `<span>` element;

This functionality is defined by the `DOMTagName` property on prototypes, if you want other tag names to appear, modify that property (or just overwrite the function on certain nodes).

## License

  MIT
