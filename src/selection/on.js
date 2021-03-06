import "../arrays/map";
import "../core/array";
import "../core/document";
import "../core/noop";
import "../event/event";
import "../format/requote";
import "selection";

d4_selectionPrototype.on = function(type, listener, capture) {
  var n = arguments.length;
  if (n < 3) {

    // For on(object) or on(object, boolean), the object specifies the event
    // types and listeners to add or remove. The optional boolean specifies
    // whether the listener captures events.
    if (typeof type !== "string") {
      if (n < 2) listener = false;
      for (capture in type) this.each(d4_selection_on(capture, type[capture], listener));
      return this;
    }

    // For on(string), return the listener for the first node.
    if (n < 2) return (n = this.node()["__on" + type]) && n._;

    // For on(string, function), use the default capture.
    capture = false;
  }

  // Otherwise, a type, listener and capture are specified, and handled as below.
  return this.each(d4_selection_on(type, listener, capture));
};

function d4_selection_on(type, listener, capture) {
  var name = "__on" + type,
      i = type.indexOf("."),
      wrap = d4_selection_onListener;

  if (i > 0) type = type.substring(0, i);
  var filter = d4_selection_onFilters.get(type);
  if (filter) type = filter, wrap = d4_selection_onFilter;

  function onRemove() {
    var l = this[name];
    if (l) {
      this.removeEventListener(type, l, l.$);
      delete this[name];
    }
  }

  function onAdd() {
    var l = wrap(listener, d4_array(arguments));
    onRemove.call(this);
    this.addEventListener(type, this[name] = l, l.$ = capture);
    l._ = listener;
  }

  function removeAll() {
    var re = new RegExp("^__on([^.]+)" + d4.requote(type) + "$"),
        match;
    for (var name in this) {
      if (match = name.match(re)) {
        var l = this[name];
        this.removeEventListener(match[1], l, l.$);
        delete this[name];
      }
    }
  }

  return i
      ? listener ? onAdd : onRemove
      : listener ? d4_noop : removeAll;
}

var d4_selection_onFilters = d4.map({
  mouseenter: "mouseover",
  mouseleave: "mouseout"
});

d4_selection_onFilters.forEach(function(k) {
  if ("on" + k in d4_document) d4_selection_onFilters.remove(k);
});

function d4_selection_onListener(listener, argumentz) {
  return function(e) {
    var o = d4.event; // Events can be reentrant (e.g., focus).
    d4.event = e;
    argumentz[0] = this.__data__;
    try {
      listener.apply(this, argumentz);
    } finally {
      d4.event = o;
    }
  };
}

function d4_selection_onFilter(listener, argumentz) {
  var l = d4_selection_onListener(listener, argumentz);
  return function(e) {
    var target = this, related = e.relatedTarget;
    if (!related || (related !== target && !(related.compareDocumentPosition(target) & 8))) {
      l.call(target, e);
    }
  };
}
