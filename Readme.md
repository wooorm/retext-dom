# retext-dom [![Build Status](https://img.shields.io/travis/wooorm/retext-dom.svg?style=flat)](https://travis-ci.org/wooorm/retext-dom) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-dom.svg?style=flat)](https://coveralls.io/r/wooorm/retext-dom?branch=master)

Create a (living) DOM tree from a TextOM tree with **[retext](https://github.com/wooorm/retext)**. Living? Well, when the TextOM tree changes, so will the DOM tree.

Note: **retext-dom** only works in the browser (d’oh), or with a Node DOM such as [jsdom](https://www.npmjs.org/package/jsdom).

## Installation

npm:
```sh
$ npm install retext-dom
```

Component:
```sh
$ component install wooorm/retext-dom
```

Bower:
```sh
$ bower install retext-dom
```

## Usage

```js
var Retext = require('retext');
var dom = require('retext-dom');

var retext = new Retext().use(dom);

retext.parse('Some English words.', function (err, tree) {
    if (err) throw err;

    console.log(tree.toDOMNode().outerHTML);
    /**
     * Logs the following (whitespace added):
     * <div>
     *     <p>
     *         <span>
     *             <span>Some</span>
     *             <span> </span>
     *             <span>English</span>
     *             <span> </span>
     *             <span>words</span>
     *             <span>.</span>
     *         </span>
     *     </p>
     * </div>
     */

     var $elementNode = document.querySelector('some-dom-node');

    /**
     * Append the node belonging to the TextOM tree to the DOM.
     */

    $elementNode.appendChild(tree.toDOMNode());

    /**
     * Log click events.
     */

    $elementNode.addEventListener('click', function (event) {
        /**
         * The DOM elements belonging to TextOM all have a
         * `TextOMNode` property referencing back to the
         * TextOM tree.
         */

        if (event.target.TextOMNode) {
            console.log(event.target.TextOMNode.toString());
        }
    });
});
```

## API

### [TextOM.Node](https://github.com/wooorm/textom#textomnode-nlcstnode)#toDOMNode()

```js
tree.toDOMNode() // `<div>...</div>`
tree.head.toDOMNode() // `<p>...</p>`
tree.head.head.toDOMNode() // `<span>...</span>`
tree.head.head.head.toDOMNode() // `<span>Some</span>`
```

Returns the DOM node belonging to the TextOM node.

Which tag?

- `ParagraphNode`'s create a `<p>` element;
- `RootNode`s create a `<div>` element;
- All other TextOM nodes create a `<span>` element;

## License

MIT © Titus Wormer
