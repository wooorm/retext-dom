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
    previousParent.toDOMNode().removeChild(node.toDOMNode());
}

/**
 * Event handler for a value-change in a TextOM text
 * node.
 *
 * @param {Node} node - Changed node.
 */

function onchangetextinside(node, newValue) {
    node.toDOMNode().textContent = newValue;
}

/**
 * Get the DOM node-equivalent from a TextOM node.
 *
 * On initial run, a DOM node is created. If a
 * `DOMTagName` property exists on the context
 * a DOM text node is created. Otherwise, an
 * DOM element is created of type `DOMTagName`.
 *
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

        if (!self.DOMTagName) {
            onchangetextinside(self, self.toString(), null);
        } else if ('visit' in self) {
            self.visit(oninsertinside);
        }
    }

    return DOMNode;
}

/**
 * Define `plugin`.
 *
 * @param {Node} tree - TextOM node.
 */

function plugin(tree) {
    tree.on('insertinside', oninsertinside);
    tree.on('removeinside', onremoveinside);
    tree.on('changetextinside', onchangetextinside);
}

/**
 * Define `attach`.
 *
 * @param {Retext} retext - Instance of Retext.
 */

function attach(retext) {
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
}

/**
 * Expose `attach`.
 */

plugin.attach = attach;

/**
 * Expose `plugin`.
 */

module.exports = plugin;
