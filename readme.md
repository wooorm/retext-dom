# retext-dom [![Build Status](https://img.shields.io/travis/wooorm/retext-dom.svg)](https://travis-ci.org/wooorm/retext-dom) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/retext-dom.svg)](https://codecov.io/github/wooorm/retext-dom)

Create a DOM tree from a [**retext**](https://github.com/wooorm/retext)
document.

Note: **retext-dom** only works in the browser (d’oh), or with a Node.js DOM
such as [jsdom](https://www.npmjs.org/package/jsdom).

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install retext-dom
```

**retext-dom** is also available for [bower](http://bower.io/#install-packages),
[component](https://github.com/componentjs/component), and
[duo](http://duojs.org/#getting-started), and as an AMD, CommonJS, and globals
module, [uncompressed](retext-dom.js) and
[compressed](retext-dom.min.js).

## Usage

```javascript
var retext = require('retext');
var dom = require('retext-dom');
var processor = retext().use(dom);

processor.process('A simple English sentence.', function (err, file, $node) {
    console.log($node.outerHTML);
});
```

Yields (**Note**: White-space between nodes added for readability,
this is not actually inserted!):

```html
<div>
  <p>
    <span>
      <span>A</span>
      <span> </span>
      <span>simple</span>
      <span> </span>
      <span>English</span>
      <span> </span>
      <span>sentence</span>
      <span>.</span>
    </span>
  </p>
</div>
```

## API

### [retext](https://github.com/wooorm/retext#api)\.[use](https://github.com/wooorm/retext#retextuseplugin-options)([dom](#api)\[, options\])

Instead of compiling to text, generate a DOM-node.

**Parameters**:

*   `dom` — This module;

*   `options` (`Object`, optional):

    *   `tags` (`Object`, optional) — Object of
        [nlcst types](https://github.com/wooorm/nlcst) mapping to HTML tags.
        The initial values look as follows:

        ```js
        {
            'WhiteSpaceNode': 'span',
            'PunctuationNode': 'span',
            'SymbolNode': 'span',
            'ParagraphNode': 'p',
            'RootNode': 'div'
        }
        ```

        When omitted, the default is a `#text` for nodes with a value, and a
        `span` for all others.

## Integrations

All [**nlcst** nodes](https://github.com/wooorm/nlcst) can be re-created as
DOM-nodes. In addition, **retext-dom** looks for an `attributes` object on each
node it compiles and adds the found properties as HTML attributes on the
generated DOM node.

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
