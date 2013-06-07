import "../selection/each";
import "transition";

d4_transitionPrototype.duration = function(value) {
  var id = this.id;
  return d4_selection_each(this, typeof value === "function"
      ? function(node, i, j) { node.__transition__[id].duration = Math.max(1, value.call(node, node.__data__, i, j) | 0); }
      : (value = Math.max(1, value | 0), function(node) { node.__transition__[id].duration = value; }));
};
