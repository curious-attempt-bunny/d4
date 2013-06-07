import "transition";

d4_transitionPrototype.transition = function() {
  var id0 = this.id,
      id1 = ++d4_transitionId,
      subgroups = [],
      subgroup,
      group,
      node,
      transition;

  for (var j = 0, m = this.length; j < m; j++) {
    subgroups.push(subgroup = []);
    for (var group = this[j], i = 0, n = group.length; i < n; i++) {
      if (node = group[i]) {
        transition = Object.create(node.__transition__[id0]);
        transition.delay += transition.duration;
        d4_transitionNode(node, i, id1, transition);
      }
      subgroup.push(node);
    }
  }

  return d4_transition(subgroups, id1);
};
