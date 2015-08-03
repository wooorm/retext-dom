'use strict';

/* eslint-env mocha */

/* Fool browserify (no one likes a DOM in a DOM). */

/* istanbul ignore else */
if (typeof window !== 'object') {
    global.window = require('js' + 'dom').jsdom().defaultView;
    global.document = window.document;
}

/*
 * Dependencies.
 */

var assert = require('assert');
var retext = require('retext');
var dom = require('..');

/*
 * Methods.
 */

var equal = assert.equal;

/*
 * Fixtures.
 */

var fixture = 'A simple English sentence.';

/*
 * Tests.
 */

describe('dom()', function () {
    retext().use(dom).process(fixture, function (err, file, $node) {
        it('should not fail', function (done) {
            done(err);
        });

        it('should create an HTML node', function () {
            equal($node.tagName.toLowerCase(), 'div');

            equal($node.outerHTML, [
                '<div>',
                    '<p>',
                        '<span>',
                            '<span>A</span>',
                            '<span> </span>',
                            '<span>simple</span>',
                            '<span> </span>',
                            '<span>English</span>',
                            '<span> </span>',
                            '<span>sentence</span>',
                            '<span>.</span>',
                        '</span>',
                    '</p>',
                '</div>'
            ].join(''));

        });
    });

    it('should add `attributes`', function (done) {
        retext().use(function () {
            return function (cst) {
                var word = cst.children[0].children[0].children[0];

                word.attributes = {
                    'id': 'foo',
                    'class': 'word-node',
                    'hidden': null
                };
            }
        }).use(dom).process('Foo', function (err, file, $node) {
            var $word = $node.querySelector('#foo');
            done(err);

            assert($word);
            equal($word.className, 'word-node');
        });
    });

    it('should support void nodes', function (done) {
        retext().use(function () {
            return function (cst) {
                var word = cst.children[0].children[0].children[0];

                word.attributes = {
                    'id': 'foo'
                };

                delete word.children;
            }
        }).use(dom).process('Foo', done);
    });

    it('should not fail on attributes on text-nodes', function (done) {
        retext().use(function () {
            return function (cst) {
                var word = cst.children[0].children[0].children[0];

                word.children[0].attributes = {
                    'id': 'foo'
                };
            }
        }).use(dom).process('Foo', done);
    });
});
