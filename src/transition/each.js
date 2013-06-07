import "../selection/each";
import "transition";

d4_transitionPrototype.each = function(type, listener) {
  var id = this.id;
  if (arguments.length < 2) {
    var inherit = d4_transitionInherit,
        inheritId = d4_transitionInheritId;
    d4_transitionInheritId = id;
    d4_selection_each(this, function(node, i, j) {
      d4_transitionInherit = node.__transition__[id];
      type.call(node, node.__data__, i, j);
    });
    d4_transitionInherit = inherit;
    d4_transitionInheritId = inheritId;
  } else {
    d4_selection_each(this, function(node) {
      node.__transition__[id].event.on(type, listener);
    });
  }
  return this;
};
