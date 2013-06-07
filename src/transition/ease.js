import "../interpolate/ease";
import "../selection/each";
import "transition";

d4_transitionPrototype.ease = function(value) {
  var id = this.id;
  if (arguments.length < 1) return this.node().__transition__[id].ease;
  if (typeof value !== "function") value = d4.ease.apply(d4, arguments);
  return d4_selection_each(this, function(node) { node.__transition__[id].ease = value; });
};
