import "selection";

// TODO remove(selector)?
// TODO remove(node)?
// TODO remove(function)?
d4_selectionPrototype.remove = function() {
  return this.each(function() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  });
};
