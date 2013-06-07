import "../core/array";
import "selection";

d4_selectionPrototype.call = function(callback) {
  var args = d4_array(arguments);
  callback.apply(args[0] = this, args);
  return this;
};
