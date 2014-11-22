'use strict';

var visit;

/**
 * Module dependencies.
 */

visit = require('retext-visit');

/**
 * Throw when not running in the browser (or a
 * simulated browser environment).
 */

/* istanbul ignore if */
if (typeof document !== 'object') {
    throw new Error(
        'Missing document object for `retext-dom`.'
    );
}

/**
 * Event handler for an inserted TextOM node.
 *
 * @param {Node} node - Insertion.
 */

function oninsertinside(node) {
    node.parent.toDOMNode().insertBefore(node.toDOMNode(),
        node.prev ? node.prev.toDOMNode().nextSibling : null
    );
}

/**
 * Event handler for a removed TextOM node.
 *
 * @param {Node} node - Deletion.
 */

function onremoveinside(node, previousParent) {
    if (node.toDOMNode().parentNode === previousParent.toDOMNode()) {
        previousParent.toDOMNode().removeChild(node.toDOMNode());
    }
}

/**
 * Event handler for a value-change in a TextOM text
 * node.
 *
 * @param {Node} node - Changed node.
 */

function onchangetextinside(node, value) {
    if (node.toString() === value) {
        node.toDOMNode().textContent = value;
    }
}

/**
 * Get the DOM node-equivalent from a TextOM node.
 *
 * On initial run, a DOM node is created. If a
 * `DOMTagName` property exists on the context
 * a DOM element is created of type `DOMTagName`.
 * Otherwise, a DOM text node is created.
 *
 * @this {Node}
 * @return {Node} DOM node.
 */

function toDOMNode() {
    var self,
        DOMNode;

    self = this;
    DOMNode = self.DOMNode;

    if (!DOMNode) {
        if (!self.DOMTagName) {
            DOMNode = document.createTextNode('');
        } else {
            DOMNode = document.createElement(self.DOMTagName);
        }

        /**
         * Store DOM node on context.
         */

        self.DOMNode = DOMNode;

        /**
         * Store context on DOM node.
         */

        DOMNode.TextOMNode = self;

        /**
         * Fake change events.
         */

        if ('visit' in self) {
            self.visit(oninsertinside);
        } else if (self.nodeName === self.TEXT) {
            onchangetextinside(self, self.toString(), null);
        }
    }

    return DOMNode;
}

/**
 * Define `onrun`.
 *
 * @param {Node} tree - TextOM node.
 */

function onrun(tree) {
    tree.on('insertinside', oninsertinside);
    tree.on('removeinside', onremoveinside);
    tree.on('changetextinside', onchangetextinside);
}

/**
 * Define `plugin`.
 *
 * @param {Retext} retext - Instance of Retext.
 */

function plugin(retext) {
    var TextOM;

    /**
     * Depend on `retext-visit`.
     */

    retext.use(visit);

    TextOM = retext.TextOM;

    TextOM.Node.prototype.toDOMNode = toDOMNode;

    TextOM.Node.prototype.DOMTagName = 'span';
    TextOM.RootNode.prototype.DOMTagName = 'div';
    TextOM.ParagraphNode.prototype.DOMTagName = 'p';

    TextOM.Text.prototype.DOMTagName = null;

    return onrun;
}

/**
 * Expose `plugin`.
 */

module.exports = plugin;
