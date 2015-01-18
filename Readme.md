# retext-dom [![Build Status](https://img.shields.io/travis/wooorm/retext-dom.svg?style=flat)](https://travis-ci.org/wooorm/retext-dom) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-dom.svg?style=flat)](https://coveralls.io/r/wooorm/retext-dom?branch=master)

Create a DOM tree from a **[retext](https://github.com/wooorm/retext)** document. When the tree changes, so will the DOM tree.

Note: **retext-dom** only works in the browser (d’oh), or with a Node.js DOM such as [jsdom](https://www.npmjs.org/package/jsdom).

## Installation

npm:

```bash
$ npm install retext-dom
```

Component:

```bash
$ component install wooorm/retext-dom
```

Bower:

```bash
$ bower install retext-dom
```

## Usage

```javascript
var Retext = require('retext');
var dom = require('retext-dom');

var retext = new Retext().use(dom);

retext.parse('Some English words.', function (err, tree) {
    if (err) throw err;

    console.log(tree.toDOMNode().outerHTML);
    /*
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

    /*
     * Append the node belonging to the TextOM tree to the DOM.
     */

    $elementNode.appendChild(tree.toDOMNode());

    /*
     * Log click events.
     */

    $elementNode.addEventListener('click', function (event) {
        /*
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

```javascript
tree.toDOMNode() // `<div>...</div>`
tree.head.toDOMNode() // `<p>...</p>`
tree.head.head.toDOMNode() // `<span>...</span>`
tree.head.head.head.toDOMNode() // `<span>Some</span>`
tree.head.head.tail.toDOMNode() // `"."` (a text node)
```

Returns the DOM node belonging to the TextOM node.

Which tag?

- `ParagraphNode`'s create a `<p>` element;
- `RootNode`s create a `<div>` element;
- All other TextOM nodes create a `<span>` element;

This has to do with the `DOMTagName` on a node's prototype. If it exists, a DOM node of that type is created. Otherwise, a DOM text node is created.

## Performance

On a MacBook air (in Node.js, with jsdom’s DOM):

```text
           retext.parse
  200 op/s » A paragraph (5 sentences, 100 words)
   20 op/s » A section (10 paragraphs, 50 sentences, 1,000 words)

           retext.parse and Node.toDOMNode()
   20 op/s » A paragraph (5 sentences, 100 words)
    2 op/s » A section (10 paragraphs, 50 sentences, 1,000 words)
```

## License

MIT © [Titus Wormer](http://wooorm.com)
