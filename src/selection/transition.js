import "selection";

d4_selectionPrototype.transition = function() {
  var id = d4_transitionInheritId || ++d4_transitionId,
      subgroups = [],
      subgroup,
      node,
      transition = Object.create(d4_transitionInherit);

  transition.time = Date.now();

  for (var j = -1, m = this.length; ++j < m;) {
    subgroups.push(subgroup = []);
    for (var group = this[j], i = -1, n = group.length; ++i < n;) {
      if (node = group[i]) d4_transitionNode(node, i, id, transition);
      subgroup.push(node);
    }
  }

  return d4_transition(subgroups, id);
};
