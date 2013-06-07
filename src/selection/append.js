import "../core/document";
import "../core/ns";
import "selection";

// TODO append(node)?
// TODO append(function)?
d4_selectionPrototype.append = function(name) {
  name = d4.ns.qualify(name);

  function append() {
    return this.appendChild(d4_document.createElementNS(this.namespaceURI, name));
  }

  function appendNS() {
    return this.appendChild(d4_document.createElementNS(name.space, name.local));
  }

  return this.select(name.local ? appendNS : append);
};
