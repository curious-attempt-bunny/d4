import "../core/array";
import "selection";

function d4_selection_enter(selection) {
  d4_arraySubclass(selection, d4_selection_enterPrototype);
  return selection;
}

var d4_selection_enterPrototype = [];

d4.selection.enter = d4_selection_enter;
d4.selection.enter.prototype = d4_selection_enterPrototype;

d4_selection_enterPrototype.append = d4_selectionPrototype.append;
d4_selection_enterPrototype.insert = d4_selectionPrototype.insert;
d4_selection_enterPrototype.empty = d4_selectionPrototype.empty;
d4_selection_enterPrototype.node = d4_selectionPrototype.node;

import "enter-select";
