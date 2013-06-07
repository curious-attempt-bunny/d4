import "../core/document";
import "../core/ns";
import "selection";

d4_selectionPrototype.insert = function(name, before) {
  name = d4.ns.qualify(name);

  if (typeof before !== "function") before = d4_selection_selector(before);

  function insert(d, i) {
    return this.insertBefore(
        d4_document.createElementNS(this.namespaceURI, name),
        before.call(this, d, i));
  }

  function insertNS(d, i) {
    return this.insertBefore(
        d4_document.createElementNS(name.space, name.local),
        before.call(this, d, i));
  }

  return this.select(name.local ? insertNS : insert);
};
