'use strict';

var retextDOM, jsdom, Retext, assert, TextOM, retext;

/* istanbul ignore else */
if (typeof window !== 'object') {
    /* Fool browserify (no one likes a DOM in a DOM). */
    jsdom = require('js' + 'dom');
    global.window = jsdom.jsdom().parentWindow;
    global.document = window.document;
}

retextDOM = require('..');

Retext = require('retext');
assert = require('assert');

retext = new Retext().use(retextDOM);
TextOM = retext.parser.TextOM;

describe('retext-dom', function () {
    it('should be of type `function`', function () {
        assert(typeof retextDOM === 'function');
    });

    it('should export an `attach` method', function () {
        assert(typeof retextDOM.attach === 'function');
    });

    it('should create a DOM tree from the TextOM tree', function () {
        var tree = retext.parse('Some English words.'),
            $div = tree.toDOMNode(),
            sentenceNode = tree.head.head,
            $sentence = $div.childNodes[0].childNodes[0];

        /* Validate Paragraph node. */
        assert($div.childNodes[0] === tree.head.toDOMNode());

        /* Validate Sentence node. */
        assert($sentence === sentenceNode.toDOMNode());

        /* validate Text nodes */
        assert($sentence.childNodes[0] === sentenceNode[0].toDOMNode());
        assert($sentence.childNodes[1] === sentenceNode[1].toDOMNode());
        assert($sentence.childNodes[2] === sentenceNode[2].toDOMNode());
        assert($sentence.childNodes[3] === sentenceNode[3].toDOMNode());
        assert($sentence.childNodes[4] === sentenceNode[4].toDOMNode());
        assert($sentence.childNodes[5] === sentenceNode[5].toDOMNode());
        assert($sentence.childNodes.length === sentenceNode.length);

        /* validate HTML */
        assert(
            $div.outerHTML === '<div>' +
                '<p>' +
                    '<span>' +
                        '<span>Some</span>' +
                        '<span> </span>' +
                        '<span>English</span>' +
                        '<span> </span>' +
                        '<span>words</span>' +
                        '<span>.</span>' +
                    '</span>' +
                '</p>' +
            '</div>'
        );
    });

    it('should update the DOM when nodes are removed/inserted', function () {
        var tree = retext.parse('Some English words.'),
            $div = tree.toDOMNode(),
            sentenceNode = tree.head.head,
            wordNode = sentenceNode[2],
            whiteSpaceNode = sentenceNode[3],
            $sentence = $div.childNodes[0].childNodes[0];

        /* Remove “English” and it following space */
        wordNode.remove();
        whiteSpaceNode.remove();

        /* validate Text nodes */
        assert($sentence.childNodes[0] === sentenceNode[0].toDOMNode());
        assert($sentence.childNodes[1] === sentenceNode[1].toDOMNode());
        assert($sentence.childNodes[2] === sentenceNode[2].toDOMNode());
        assert($sentence.childNodes[3] === sentenceNode[3].toDOMNode());
        assert($sentence.childNodes.length === sentenceNode.length);

        /* validate HTML */
        assert(
            $div.outerHTML === '<div>' +
                '<p>' +
                    '<span>' +
                        '<span>Some</span>' +
                        '<span> </span>' +
                        '<span>words</span>' +
                        '<span>.</span>' +
                    '</span>' +
                '</p>' +
            '</div>'
        );

        /* Insert “English” and it following space */
        sentenceNode[1].after(whiteSpaceNode);
        whiteSpaceNode.before(wordNode);

        /* validate Text nodes */
        assert($sentence.childNodes[0] === sentenceNode[0].toDOMNode());
        assert($sentence.childNodes[1] === sentenceNode[1].toDOMNode());
        assert($sentence.childNodes[2] === sentenceNode[2].toDOMNode());
        assert($sentence.childNodes[3] === sentenceNode[3].toDOMNode());
        assert($sentence.childNodes[4] === sentenceNode[4].toDOMNode());
        assert($sentence.childNodes[5] === sentenceNode[5].toDOMNode());
        assert($sentence.childNodes.length === sentenceNode.length);

        /* validate HTML */
        assert(
            $div.outerHTML === '<div>' +
                '<p>' +
                    '<span>' +
                        '<span>Some</span>' +
                        '<span> </span>' +
                        '<span>English</span>' +
                        '<span> </span>' +
                        '<span>words</span>' +
                        '<span>.</span>' +
                    '</span>' +
                '</p>' +
            '</div>'
        );
    });

    it('should update the DOM when a text value changes', function () {
        var tree = retext.parse('Some English words.'),
            $div = tree.toDOMNode();

        /* Change the terminal marker from a full-stop to a bang */
        tree.head.head.tail.fromString('!');

        /* Validate text content */
        assert(tree.head.head.tail.toDOMNode().textContent === '!');

        /* validate HTML */
        assert(
            $div.outerHTML === '<div>' +
                '<p>' +
                    '<span>' +
                        '<span>Some</span>' +
                        '<span> </span>' +
                        '<span>English</span>' +
                        '<span> </span>' +
                        '<span>words</span>' +
                        '<span>!</span>' +
                    '</span>' +
                '</p>' +
            '</div>'
        );
    });
});

describe('TextOM.Node#', function () {
    it('should have a `toDOMNode` method', function () {
        assert(typeof (new TextOM.Node()).toDOMNode === 'function');
    });

    it('should have a `DOMTagName` property set to `span`', function () {
        assert(new TextOM.Node().DOMTagName === 'span');
    });

    it('should return a span element `toDOMNode()`', function () {
        assert(
            new TextOM.Node().toDOMNode().nodeName.toLowerCase() === 'span'
        );
    });
});

describe('TextOM.RootNode#', function () {
    it('should have a `toDOMNode` method', function () {
        assert(typeof (new TextOM.RootNode()).toDOMNode === 'function');
    });

    it('should have a `DOMTagName` property set to `span`', function () {
        assert(new TextOM.RootNode().DOMTagName === 'div');
    });

    it('should return a span element `toDOMNode()`', function () {
        assert(
            new TextOM.RootNode().toDOMNode().nodeName.toLowerCase() === 'div'
        );
    });
});

describe('TextOM.ParagraphNode#', function () {
    it('should have a `toDOMNode` method', function () {
        assert(typeof (new TextOM.ParagraphNode()).toDOMNode === 'function');
    });

    it('should have a `DOMTagName` property set to `span`', function () {
        assert(new TextOM.ParagraphNode().DOMTagName === 'p');
    });

    it('should return a span element `toDOMNode()`', function () {
        assert(
            new TextOM.ParagraphNode().toDOMNode()
                .nodeName.toLowerCase() === 'p'
        );
    });
});
