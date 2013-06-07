import "../arrays/ascending";
import "selection";

d4_selectionPrototype.sort = function(comparator) {
  comparator = d4_selection_sortComparator.apply(this, arguments);
  for (var j = -1, m = this.length; ++j < m;) this[j].sort(comparator);
  return this.order();
};

function d4_selection_sortComparator(comparator) {
  if (!arguments.length) comparator = d4.ascending;
  return function(a, b) {
    return (!a - !b) || comparator(a.__data__, b.__data__);
  };
}
