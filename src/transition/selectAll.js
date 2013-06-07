import "../selection/select";
import "transition";

d4_transitionPrototype.selectAll = function(selector) {
  var id = this.id,
      subgroups = [],
      subgroup,
      subnodes,
      node,
      subnode,
      transition;

  if (typeof selector !== "function") selector = d4_selection_selectorAll(selector);

  for (var j = -1, m = this.length; ++j < m;) {
    for (var group = this[j], i = -1, n = group.length; ++i < n;) {
      if (node = group[i]) {
        transition = node.__transition__[id];
        subnodes = selector.call(node, node.__data__, i);
        subgroups.push(subgroup = []);
        for (var k = -1, o = subnodes.length; ++k < o;) {
          d4_transitionNode(subnode = subnodes[k], k, id, transition);
          subgroup.push(subnode);
        }
      }
    }
  }

  return d4_transition(subgroups, id);
};
