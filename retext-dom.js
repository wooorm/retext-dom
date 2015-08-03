(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.retextDOM = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @author Titus Wormer
 * @copyright 2014-2015 Titus Wormer
 * @license MIT
 * @module retext:dom
 * @fileoverview Compile NLCST to a DOM tree.
 */

'use strict';

/*
 * Dependencies.
 */

var nlcstToString = require('nlcst-to-string');
var extend = require('extend.js');

/*
 * Throw when not running in the browser (or a
 * simulated browser environment).
 */

/* istanbul ignore if */
if (typeof document !== 'object') {
    throw new Error('missing document object');
}

/*
 * Default map of NLCST node types mapping to DOM
 * tag names.
 */

var defaults = {
    'WhiteSpaceNode': 'span',
    'PunctuationNode': 'span',
    'SymbolNode': 'span',
    'ParagraphNode': 'p',
    'RootNode': 'div'
}

/**
 * Convert `node` (NLCST) into a DOM node.
 *
 * @param {NLCSTNode} node - Node to convert.
 * @param {Object.<string, string?>} names - Map of NLCST
 *   node types mapping to DOM tag names.
 * @return {HTMLElement} - Converted `node`.
 */
function toDOMNode(node, names) {
    var $node;
    var name = names[node.type];
    var children = node.children;
    var length = children && children.length;
    var index = -1;
    var attributes = node.attributes;
    var key;
    var value;

    /*
     * Ensure text-nodes are only created when with value
     * and without name.
     */

    if (!name && 'value' in node) {
        $node = document.createTextNode('');
    } else {
        $node = document.createElement(name || 'span');
    }

    /*
     * Ignore attributes when operating on a `#text`.
     */

    if (attributes && 'setAttribute' in $node) {
        for (key in attributes) {
            value = attributes[key];

            if (value !== null && value !== undefined) {
                $node.setAttribute(key, value);
            }
        }
    }

    /*
     * Set `textContent` when with `value`, otherwise,
     * append each child.
     */

    if ('value' in node) {
        $node.textContent = nlcstToString(node);
    } else if ('children' in node) {
        while (++index < length) {
            $node.appendChild(toDOMNode(children[index], names));
        }
    }

    return $node;
}

/**
 * Attach a DOM-compiler to retext.
 *
 * @param {Retext} retext - Instance.
 * @param {Object} [options] - Option configuration.
 */
function attacher(retext, options) {
    var names = extend({}, defaults, (options || {}).tags);

    /**
     * Construct a new compiler.
     *
     * @example
     *   var domCompiler = new DOMCompiler(new File('Foo'));
     *
     * @constructor
     * @class {DOMCompiler}
     * @param {File} file - Virtual file.
     */
    function DOMCompiler(file) {
        this.file = file;
    }

    /**
     * Stringify the bound file.
     *
     * @example
     *   var file = new VFile('Foo');
     *
     *   file.namespace('retext').cst = {
     *     type: 'WordNode',
     *     children: [{
     *       type: 'TextNode',
     *       value: 'Foo'
     *     }]
     *   });
     *
     *   new DOMCompiler(file).compile();
     *   // '<span>Foo</span>'
     *
     * @this {DOMCompiler}
     * @return {HTMLElement} - DOM element.
     */
    function compile() {
        return toDOMNode(this.file.namespace('retext').cst, names);
    }

    /*
     * Attach.
     */

    DOMCompiler.prototype.compile = compile;

    retext.Compiler = DOMCompiler;
}

/*
 * Expose.
 */

module.exports = attacher;

},{"extend.js":2,"nlcst-to-string":3}],2:[function(require,module,exports){
/**
 * Extend an object with another.
 *
 * @param {Object, ...} src, ...
 * @return {Object} merged
 * @api private
 */

module.exports = function(src) {
  var objs = [].slice.call(arguments, 1), obj;

  for (var i = 0, len = objs.length; i < len; i++) {
    obj = objs[i];
    for (var prop in obj) {
      src[prop] = obj[prop];
    }
  }

  return src;
}

},{}],3:[function(require,module,exports){
'use strict';

/**
 * Stringify an NLCST node.
 *
 * @param {NLCSTNode} nlcst
 * @return {string}
 */
function nlcstToString(nlcst) {
    var values,
        length,
        children;

    if (typeof nlcst.value === 'string') {
        return nlcst.value;
    }

    children = nlcst.children;
    length = children.length;

    /**
     * Shortcut: This is pretty common, and a small performance win.
     */

    if (length === 1 && 'value' in children[0]) {
        return children[0].value;
    }

    values = [];

    while (length--) {
        values[length] = nlcstToString(children[length]);
    }

    return values.join('');
}

/*
 * Expose `nlcstToString`.
 */

module.exports = nlcstToString;

},{}]},{},[1])(1)
});