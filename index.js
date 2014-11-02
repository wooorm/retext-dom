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
            var domNode;

            domNode = node.toDOMNode();

            if (!node.DOMTagName) {
                return;
            }

            domNode.classList.add(typeMap[node.type]);
            domNode.setAttribute('data-content', node.toString());
        });

        tree.toDOMNode().classList.add(typeMap[tree.type]);
        tree.toDOMNode().setAttribute('data-content', tree.toString());

        outputElement.appendChild(tree.DOMNode);
    });
}

inputElement.addEventListener('input', oninputchange);

oninputchange({'target' : inputElement});
