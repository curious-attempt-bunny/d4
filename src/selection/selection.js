import "../core/array";
import "../core/document";

function d4_selection(groups) {
  d4_arraySubclass(groups, d4_selectionPrototype);
  return groups;
}

var d4_select = function(s, n) { return n.querySelector(s); },
    d4_selectAll = function(s, n) { return n.querySelectorAll(s); },
    d4_selectRoot = d4_document.documentElement,
    d4_selectMatcher = d4_selectRoot.matchesSelector || d4_selectRoot.webkitMatchesSelector || d4_selectRoot.mozMatchesSelector || d4_selectRoot.msMatchesSelector || d4_selectRoot.oMatchesSelector,
    d4_selectMatches = function(n, s) { return d4_selectMatcher.call(n, s); };

// Prefer Sizzle, if available.
if (typeof Sizzle === "function") {
  d4_select = function(s, n) { return Sizzle(s, n)[0] || null; };
  d4_selectAll = function(s, n) { return Sizzle.uniqueSort(Sizzle(s, n)); };
  d4_selectMatches = Sizzle.matchesSelector;
}

d4.selection = function() {
  return d4_selectionRoot;
};

var d4_selectionPrototype = d4.selection.prototype = [];

import "select";
import "selectAll";
import "attr";
import "classed";
import "style";
import "property";
import "text";
import "html";
import "append";
import "insert";
import "remove";
import "data";
import "datum";
import "filter";
import "order";
import "sort";
import "on";
import "each";
import "call";
import "empty";
import "node";
import "enter";
import "transition";

// TODO fast singleton implementation?
d4.select = function(node) {
  var group = [typeof node === "string" ? d4_select(node, d4_document) : node];
  group.parentNode = d4_selectRoot;
  return d4_selection([group]);
};

d4.selectAll = function(nodes) {
  var group = d4_array(typeof nodes === "string" ? d4_selectAll(nodes, d4_document) : nodes);
  group.parentNode = d4_selectRoot;
  return d4_selection([group]);
};

var d4_selectionRoot = d4.select(d4_selectRoot);
