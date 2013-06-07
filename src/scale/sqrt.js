import "pow";
import "scale";

d4.scale.sqrt = function() {
  return d4.scale.pow().exponent(.5);
};
