'use strict';

var dom,
    content,
    jsdom,
    Retext,
    assert,
    TextOM,
    retext;

/**
 * JSDOM dependency.
 */

/* istanbul ignore else */
if (typeof window !== 'object') {
    /* Fool browserify (no one likes a DOM in a DOM). */
    jsdom = require('js' + 'dom');
    global.window = jsdom.jsdom().parentWindow;
    global.document = window.document;
}

/**
 * Module dependencies.
 */

dom = require('..');
content = require('retext-content');
Retext = require('retext');
assert = require('assert');

retext = new Retext().use(content).use(dom);
TextOM = retext.TextOM;

/**
 * Unit tests for `retext-dom`.
 */

describe('retext-dom', function () {
    it('should be a `function`', function () {
        assert(typeof dom === 'function');
    });

    it('should have an `attach` method', function () {
        assert(typeof dom.attach === 'function');
    });
});

/**
 * Unit tests for added properties on `TextOM.Node#`.
 */

describe('Node#', function () {
    it('should have a `DOMTagName` property set to `span`', function () {
        assert(new TextOM.Node().DOMTagName === 'span');
    });
});

/**
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

/**
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

/**
 * Unit tests for added properties on `TextOM.RootNode#`.
 */

describe('RootNode#', function () {
    it('should have a `DOMTagName` property set to `div`', function () {
        assert(new TextOM.RootNode().DOMTagName === 'div');
    });
});

/**
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

/**
 * Unit tests for added properties on `TextOM.ParagraphNode#`.
 */

describe('ParagraphNode#', function () {
    it('should have a `DOMTagName` property set to `p`', function () {
        assert(new TextOM.ParagraphNode().DOMTagName === 'p');
    });
});

/**
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

/**
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

            /**
             * Validate Paragraph node.
             */

            assert($tree.childNodes[0] === tree.head.toDOMNode());

            /**
             * Validate Sentence node.
             */

            assert($sentence === sentenceNode.toDOMNode());

            /**
             * Validate Text nodes.
             */

            assert($sentence.childNodes[0] === sentenceNode[0].toDOMNode());
            assert($sentence.childNodes[1] === sentenceNode[1].toDOMNode());
            assert($sentence.childNodes[2] === sentenceNode[2].toDOMNode());
            assert($sentence.childNodes[3] === sentenceNode[3].toDOMNode());
            assert($sentence.childNodes[4] === sentenceNode[4].toDOMNode());
            assert($sentence.childNodes[5] === sentenceNode[5].toDOMNode());
            assert($sentence.childNodes.length === sentenceNode.length);

            /**
             * Validate HTML.
             */

            assert($tree.outerHTML === '<div>' +
                    '<p>' +
                        '<span>' +
                            '<span>' +
                                'Some' +
                            '</span>' +
                            '<span>' +
                                ' ' +
                            '</span>' +
                            '<span>' +
                                'English' +
                            '</span>' +
                            '<span>' +
                                ' ' +
                            '</span>' +
                            '<span>' +
                                'words' +
                            '</span>' +
                            '<span>' +
                                '.' +
                            '</span>' +
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

            /**
             * Remove ``English ''.
             */

            wordNode.remove();
            whiteSpaceNode.remove();

            /**
             * Validate Text nodes.
             */

            assert($sentence.childNodes[0] === sentenceNode[0].toDOMNode());
            assert($sentence.childNodes[1] === sentenceNode[1].toDOMNode());
            assert($sentence.childNodes[2] === sentenceNode[2].toDOMNode());
            assert($sentence.childNodes[3] === sentenceNode[3].toDOMNode());
            assert($sentence.childNodes.length === sentenceNode.length);

            /**
             * Validate HTML.
             */

            assert(
                $tree.outerHTML === '<div>' +
                    '<p>' +
                        '<span>' +
                            '<span>' +
                                'Some' +
                            '</span>' +
                            '<span>' +
                                ' ' +
                            '</span>' +
                            '<span>' +
                                'words' +
                            '</span>' +
                            '<span>' +
                                '.' +
                            '</span>' +
                        '</span>' +
                    '</p>' +
                '</div>'
            );

            /**
             * Insert ``English ''.
             */

            sentenceNode[1].after(whiteSpaceNode);
            whiteSpaceNode.before(wordNode);

            /**
             * Validate Text nodes.
             */

            assert($sentence.childNodes[0] === sentenceNode[0].toDOMNode());
            assert($sentence.childNodes[1] === sentenceNode[1].toDOMNode());
            assert($sentence.childNodes[2] === sentenceNode[2].toDOMNode());
            assert($sentence.childNodes[3] === sentenceNode[3].toDOMNode());
            assert($sentence.childNodes[4] === sentenceNode[4].toDOMNode());
            assert($sentence.childNodes[5] === sentenceNode[5].toDOMNode());
            assert($sentence.childNodes.length === sentenceNode.length);

            /**
             * Validate HTML.
             */

            assert($tree.outerHTML === '<div>' +
                    '<p>' +
                        '<span>' +
                            '<span>' +
                                'Some' +
                            '</span>' +
                            '<span>' +
                                ' ' +
                            '</span>' +
                            '<span>' +
                                'English' +
                            '</span>' +
                            '<span>' +
                                ' ' +
                            '</span>' +
                            '<span>' +
                                'words' +
                            '</span>' +
                            '<span>' +
                                '.' +
                            '</span>' +
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
                            '<span>' +
                                'Some' +
                            '</span>' +
                            '<span>' +
                                ' ' +
                            '</span>' +
                            '<span>' +
                                'English' +
                            '</span>' +
                            '<span>' +
                                ' ' +
                            '</span>' +
                            '<span>' +
                                'words' +
                            '</span>' +
                            '<span>' +
                                '.' +
                            '</span>' +
                        '</span>' +
                    '</p>' +
                '</div>'
            );

            tree.replaceContent('Other words.');

            assert($tree.outerHTML === '<div>' +
                    '<p>' +
                        '<span>' +
                            '<span>' +
                                'Other' +
                            '</span>' +
                            '<span>' +
                                ' ' +
                            '</span>' +
                            '<span>' +
                                'words' +
                            '</span>' +
                            '<span>' +
                                '.' +
                            '</span>' +
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

            /**
             * Change the terminal marker from a full-stop to a bang.
             */

            tree.head.head.tail.head.fromString('!');

            /**
             * Validate text content.
             */

            assert(tree.head.head.tail.toDOMNode().textContent === '!');

            /**
             * Validate HTML.
             */

            assert($tree.outerHTML === '<div>' +
                    '<p>' +
                        '<span>' +
                            '<span>' +
                                'Some' +
                            '</span>' +
                            '<span>' +
                                ' ' +
                            '</span>' +
                            '<span>' +
                                'English' +
                            '</span>' +
                            '<span>' +
                                ' ' +
                            '</span>' +
                            '<span>' +
                                'words' +
                            '</span>' +
                            '<span>' +
                                '!' +
                            '</span>' +
                        '</span>' +
                    '</p>' +
                '</div>'
            );

            done(err);
        });
    });
});
