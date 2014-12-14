/**
 * Dependencies.
 */

var Retext = require('wooorm/retext@0.5.0-rc.1');
var dom = require('wooorm/retext-dom@0.3.1');
var visit = require('wooorm/retext-visit@0.2.5');

/**
 * Retext.
 */

var retext = new Retext()
    .use(dom)
    .use(visit);

/**
 * DOM elements.
 */

var $input = document.getElementsByTagName('textarea')[0];
var $output = document.getElementsByTagName('div')[0];

/**
 * Node type to className dictionary.
 */

var typeMap = {
    'RootNode' : 'root',
    'ParagraphNode' : 'paragraph',
    'SentenceNode' : 'sentence',
    'WordNode' : 'word',
    'WhiteSpaceNode' : 'white-space',
    'PunctuationNode' : 'punctuation'
}

/**
 * Events
 */

var tree;

function oninputchange() {
    if (tree) {
        tree.toDOMNode().parentNode.removeChild(tree.toDOMNode());
    }

    retext.parse($input.value, function (err, root) {
        if (err) throw err;

        tree = root;

        tree.visit(function (node) {
            if (!node.DOMTagName) {
                return
            }

            node.toDOMNode().classList.add(typeMap[node.type]);
        });

        tree.toDOMNode().classList.add(typeMap[tree.type]);

        $output.appendChild(tree.toDOMNode());
    });
}

$input.addEventListener('input', oninputchange);

oninputchange();
