'use strict';

/*
 * JSDOM dependency.
 */

var jsdom;

/* istanbul ignore else */
if (typeof window !== 'object') {
    /* Fool browserify (no one likes a DOM in a DOM). */
    jsdom = require('js' + 'dom');
    global.window = jsdom.jsdom().parentWindow;
    global.document = window.document;
}

/*
 * Dependencies.
 */

var Retext,
    dom,
    inspect,
    content,
    assert;

Retext = require('retext');
dom = require('..');
inspect = require('retext-inspect');
content = require('retext-content');
assert = require('assert');

/*
 * Retext.
 */

var retext,
    TextOM;

retext = new Retext()
    .use(inspect)
    .use(content)
    .use(dom);

TextOM = retext.TextOM;

/*
 * Unit tests for `retext-dom`.
 */

describe('retext-dom', function () {
    it('should be a `function`', function () {
        assert(typeof dom === 'function');
    });
});

/*
 * Unit tests for added properties on `TextOM.Node#`.
 */

describe('Node#', function () {
    it('should have a `DOMTagName` property set to `span`', function () {
        assert(new TextOM.Node().DOMTagName === 'span');
    });
});

/*
 * Unit tests for `TextOM.Node#toDOMNode`.
 */

describe('Node#toDOMNode()', function () {
    it('should be a `function`', function () {
        assert(typeof (new TextOM.Node()).toDOMNode === 'function');
    });

    it('should return a `<span>` element', function () {
        assert(
            new TextOM.Node().toDOMNode().nodeName.toLowerCase() === 'span'
        );
    });
});

/*
 * Unit tests for `TextOM.Text#toDOMNode`.
 */

describe('Text#toDOMNode()', function () {
    it('should be a `function`', function () {
        assert(typeof (new TextOM.Text()).toDOMNode === 'function');
    });

    it('should return a text node', function () {
        assert(
            new TextOM.Text().toDOMNode().nodeName.toLowerCase() === '#text'
        );
    });
});

/*
 * Unit tests for added properties on `TextOM.RootNode#`.
 */

describe('RootNode#', function () {
    it('should have a `DOMTagName` property set to `div`', function () {
        assert(new TextOM.RootNode().DOMTagName === 'div');
    });
});

/*
 * Unit tests for `TextOM.RootNode#toDOMNode`.
 */

describe('RootNode#toDOMNode()', function () {
    it('should be a `function`', function () {
        assert(typeof (new TextOM.RootNode()).toDOMNode === 'function');
    });

    it('should return a `<div>` element', function () {
        assert(
            new TextOM.RootNode().toDOMNode().nodeName.toLowerCase() === 'div'
        );
    });
});

/*
 * Unit tests for added properties on `TextOM.ParagraphNode#`.
 */

describe('ParagraphNode#', function () {
    it('should have a `DOMTagName` property set to `p`', function () {
        assert(new TextOM.ParagraphNode().DOMTagName === 'p');
    });
});

/*
 * Unit tests for `TextOM.ParagraphNode#toDOMNode`.
 */

describe('ParagraphNode#toDOMNode()', function () {
    it('should be a `function`', function () {
        assert(typeof (new TextOM.ParagraphNode()).toDOMNode === 'function');
    });

    it('should return a `<p>` element', function () {
        assert(
            new TextOM.ParagraphNode().toDOMNode()
                .nodeName.toLowerCase() === 'p'
        );
    });
});

/*
 * Unit tests for live syncing between TextOM and DOM.
 */

describe('Live workings', function () {
    it('should create a DOM tree from the TextOM tree', function (done) {
        retext.parse('Some English words.', function (err, tree) {
            var $tree,
                sentenceNode,
                $sentence;

            $tree = tree.toDOMNode();
            sentenceNode = tree.head.head;
            $sentence = $tree.childNodes[0].childNodes[0];

            /*
             * Validate Paragraph node.
             */

            assert($tree.childNodes[0] === tree.head.toDOMNode());

            /*
             * Validate Sentence node.
             */

            assert($sentence === sentenceNode.toDOMNode());

            /*
             * Validate Text nodes.
             */

            assert($sentence.childNodes[0] === sentenceNode[0].toDOMNode());
            assert($sentence.childNodes[1] === sentenceNode[1].toDOMNode());
            assert($sentence.childNodes[2] === sentenceNode[2].toDOMNode());
            assert($sentence.childNodes[3] === sentenceNode[3].toDOMNode());
            assert($sentence.childNodes[4] === sentenceNode[4].toDOMNode());
            assert($sentence.childNodes[5] === sentenceNode[5].toDOMNode());
            assert($sentence.childNodes.length === sentenceNode.length);

            /*
             * Validate HTML.
             */

            assert($tree.outerHTML === '<div>' +
                    '<p>' +
                        '<span>' +
                            '<span>Some</span>' +
                            ' ' +
                            '<span>English</span>' +
                            ' ' +
                            '<span>words</span>' +
                            '.' +
                        '</span>' +
                    '</p>' +
                '</div>'
            );

            done(err);
        });
    });

    it('should sync when nodes are removed/inserted', function (done) {
        retext.parse('Some English words.', function (err, tree) {
            var $tree,
                sentenceNode,
                wordNode,
                whiteSpaceNode,
                $sentence;

            $tree = tree.toDOMNode();
            sentenceNode = tree.head.head;
            wordNode = sentenceNode[2];
            whiteSpaceNode = sentenceNode[3];
            $sentence = $tree.childNodes[0].childNodes[0];

            /*
             * Remove ``English ''.
             */

            wordNode.remove();
            whiteSpaceNode.remove();

            /*
             * Validate Text nodes.
             */

            assert($sentence.childNodes[0] === sentenceNode[0].toDOMNode());
            assert($sentence.childNodes[1] === sentenceNode[1].toDOMNode());
            assert($sentence.childNodes[2] === sentenceNode[2].toDOMNode());
            assert($sentence.childNodes[3] === sentenceNode[3].toDOMNode());
            assert($sentence.childNodes.length === sentenceNode.length);

            /*
             * Validate HTML.
             */

            assert(
                $tree.outerHTML === '<div>' +
                    '<p>' +
                        '<span>' +
                            '<span>Some</span>' +
                            ' ' +
                            '<span>words</span>' +
                            '.' +
                        '</span>' +
                    '</p>' +
                '</div>'
            );

            /*
             * Insert ``English ''.
             */

            sentenceNode[1].after(whiteSpaceNode);
            whiteSpaceNode.before(wordNode);

            /*
             * Validate Text nodes.
             */

            assert($sentence.childNodes[0] === sentenceNode[0].toDOMNode());
            assert($sentence.childNodes[1] === sentenceNode[1].toDOMNode());
            assert($sentence.childNodes[2] === sentenceNode[2].toDOMNode());
            assert($sentence.childNodes[3] === sentenceNode[3].toDOMNode());
            assert($sentence.childNodes[4] === sentenceNode[4].toDOMNode());
            assert($sentence.childNodes[5] === sentenceNode[5].toDOMNode());
            assert($sentence.childNodes.length === sentenceNode.length);

            /*
             * Validate HTML.
             */

            assert($tree.outerHTML === '<div>' +
                    '<p>' +
                        '<span>' +
                            '<span>Some</span>' +
                            ' ' +
                            '<span>English</span>' +
                            ' ' +
                            '<span>words</span>' +
                            '.' +
                        '</span>' +
                    '</p>' +
                '</div>'
            );

            done(err);
        });
    });

    it('should sync when root\'s children are removed', function (done) {
        retext.parse('Some English words.', function (err, tree) {
            var $tree;

            $tree = tree.toDOMNode();

            assert($tree.outerHTML === '<div>' +
                    '<p>' +
                        '<span>' +
                            '<span>Some</span>' +
                            ' ' +
                            '<span>English</span>' +
                            ' ' +
                            '<span>words</span>' +
                            '.' +
                        '</span>' +
                    '</p>' +
                '</div>'
            );

            tree.replaceContent('Other words.');

            assert($tree.outerHTML === '<div>' +
                    '<p>' +
                        '<span>' +
                            '<span>Other</span>' +
                            ' ' +
                            '<span>words</span>' +
                            '.' +
                        '</span>' +
                    '</p>' +
                '</div>'
            );

            done(err);
        });
    });

    it('should sync when text values are changed', function (done) {
        retext.parse('Some English words.', function (err, tree) {
            var $tree;

            $tree = tree.toDOMNode();

            /*
             * Change the terminal marker from a full-stop to a bang.
             */

            tree.head.head.tail.fromString('!');

            /*
             * Validate text content.
             */

            assert(tree.head.head.tail.toDOMNode().textContent === '!');

            /*
             * Validate HTML.
             */

            assert($tree.outerHTML === '<div>' +
                    '<p>' +
                        '<span>' +
                            '<span>Some</span>' +
                            ' ' +
                            '<span>English</span>' +
                            ' ' +
                            '<span>words</span>' +
                            '!' +
                        '</span>' +
                    '</p>' +
                '</div>'
            );

            done(err);
        });
    });

    it('[remove] should not fail when the node is re-inserted',
        function (done) {
            retext.parse('A sentence. Other sentence.', function (err, tree) {
                var $tree;

                $tree = tree.toDOMNode();

                /*
                 * When the first sentence's head is
                 * removed, re-insert it in the second
                 * sentence.
                 */

                tree.head.head.head.on('remove', function () {
                    tree.head.tail.append(this);
                });

                tree.head.head.head.remove();

                assert($tree.outerHTML === '<div>' +
                        '<p>' +
                            '<span>' +
                                ' ' +
                                '<span>sentence</span>' +
                                '.' +
                            '</span>' +
                            ' ' +
                            '<span>' +
                                '<span>Other</span>' +
                                ' ' +
                                '<span>sentence</span>' +
                                '.' +
                                '<span>A</span>' +
                            '</span>' +
                        '</p>' +
                    '</div>'
                );

                done(err);
            });
        }
    );

    it('[changetext] should not fail when the value is re-changed',
        function (done) {
            retext.parse('A sentence. Other sentence.', function (err, tree) {
                var head;

                head = tree.head.head.head;

                /*
                 * When the first word's value is changed,
                 * re-change it.
                 */

                head.head.on('changetext', function () {
                    this.fromString('C');
                });

                head.head.fromString('B');

                assert(head.head.toString() === 'C');
                assert(head.toDOMNode().outerHTML === '<span>C</span>');

                done(err);
            });
        }
    );
});
