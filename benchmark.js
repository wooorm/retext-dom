'use strict';

/**
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

/**
 * Dependencies.
 */

var Retext,
    dom;

Retext = require('retext');
dom = require('./');

/**
 * Dependencies.
 */

var retext;

retext = new Retext().use(dom);

/**
 * Test data.
 *
 * This includes:
 *
 * - An average sentence (w/ 20 words);
 * - An average paragraph (w/ 5 sentences);
 * - A (big?) section (w/ 10 paragraphs);
 * - A (big?) article (w/ 10 sections);
 *
 * Source:
 *   http://www.gutenberg.org/files/10745/10745-h/10745-h.htm
 */

var sentence,
    paragraph,
    section,
    article,
    paragraphNLCST,
    sectionNLCST,
    articleNLCST;

sentence = 'Where she had stood was clear, and she was gone since Sir ' +
    'Kay does not choose to assume my quarrel.';

paragraph = 'Thou art a churlish knight to so affront a lady ' +
    'he could not sit upon his horse any longer. ' +
    'For methinks something hath befallen my lord and that he ' +
    'then, after a while, he cried out in great voice. ' +
    'For that light in the sky lieth in the south ' +
    'then Queen Helen fell down in a swoon, and lay. ' +
    'Touch me not, for I am not mortal, but Fay ' +
    'so the Lady of the Lake vanished away, everything behind. ' +
    sentence;

section = paragraph + Array(10).join('\n\n' + paragraph);

article = section + Array(10).join('\n\n' + section);

/**
 * Benchmark `fromCST`.
 */

suite('retext.parse', function () {
    bench('A paragraph (5 sentences, 100 words)', function (done) {
        retext.parse(paragraph, done);
    });

    bench('A section (10 paragraphs, 50 sentences, 1,000 words)',
        function (done) {
            retext.parse(section, done);
        }
    );
});

suite('retext.parse and Node.toDOMNode()', function () {
    bench('A paragraph (5 sentences, 100 words)', function (done) {
        retext.parse(paragraph, function (err, tree) {
            tree.toDOMNode();

            done(err);
        });
    });

    bench('A section (10 paragraphs, 50 sentences, 1,000 words)',
        function (done) {
            retext.parse(section, function (err, tree) {
                tree.toDOMNode();

                done(err);
            });
        }
    );
});
