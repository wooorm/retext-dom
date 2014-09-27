var dom = require('retext-dom'),
    visit = require('retext-visit'),
    Retext = require('retext'),
    retext = new Retext().use(dom).use(visit),
    inputElement = document.getElementsByTagName('textarea')[0],
    outputElement = document.getElementsByTagName('div')[0];

var typeMap = {
    'RootNode' : 'root',
    'ParagraphNode' : 'paragraph',
    'SentenceNode' : 'sentence',
    'WordNode' : 'word',
    'WhiteSpaceNode' : 'white-space',
    'PunctuationNode' : 'punctuation'
}

function oninputchange(event) {
    var tree;

    while (outputElement.firstChild) {
        outputElement.removeChild(outputElement.firstChild);
    }

    retext.parse(inputElement.value, function (err, tree) {
        if (err) throw err;

        tree.visit(function (node) {
            if (!node.DOMTagName) {
                return;
            }

            node.DOMNode.classList.add(typeMap[node.type]);
            node.DOMNode.setAttribute('data-content', node.toString());
        });

        tree.DOMNode.classList.add(typeMap[tree.type]);
        tree.DOMNode.setAttribute('data-content', tree.toString());

        outputElement.appendChild(tree.DOMNode);
    });
}

inputElement.addEventListener('input', oninputchange);

oninputchange({'target' : inputElement});
