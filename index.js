'use strict';

var visit = require('retext-visit');

/* istanbul ignore if: Running in the wrong environment */
if (typeof document !== 'object') {
    throw new Error('Missing document object for retext-dom');
}

function oninsertinside(node) {
    node.parent.toDOMNode().insertBefore(node.toDOMNode(),
        node.prev ? node.prev.toDOMNode().nextSibling : null
    );
}

function onremoveinside(node, previousParent) {
    previousParent.toDOMNode().removeChild(node.toDOMNode());
}

function onchangetextinside(node, newValue) {
    node.toDOMNode().textContent = newValue;
}

function toDOMNode() {
    var self = this,
        DOMNode = self.DOMNode;

    if (!DOMNode) {
        DOMNode = document.createElement(self.DOMTagName);
        self.DOMNode = DOMNode;
        DOMNode.TextOMNode = self;
    }

    return DOMNode;
}

function toDOMTextNode() {
    var self = this,
        DOMNode = self.DOMNode;

    if (!DOMNode) {
        DOMNode = document.createTextNode();
        self.DOMNode = DOMNode;
        DOMNode.TextOMNode = self;
    }

    return DOMNode;
}

function plugin(tree) {
    tree.on('insertinside', oninsertinside);
    tree.on('removeinside', onremoveinside);
    tree.on('changetextinside', onchangetextinside);

    tree.toDOMNode();

    tree.visit(function (node) {
        oninsertinside.call(tree, node);

        if (node instanceof node.TextOM.Text) {
            onchangetextinside.call(tree, node, node.toString(), null);
        }
    });
}

function attach(retext) {
    var TextOM = retext.parser.TextOM;

    retext.use(visit);

    TextOM.Node.prototype.toDOMNode = toDOMNode;

    TextOM.Node.prototype.DOMTagName = 'span';
    TextOM.RootNode.prototype.DOMTagName = 'div';
    TextOM.ParagraphNode.prototype.DOMTagName = 'p';

    TextOM.Text.prototype.toDOMNode = toDOMTextNode;
    TextOM.Text.prototype.DOMTagName = null;
}

plugin.attach = attach;

exports = module.exports = plugin;
