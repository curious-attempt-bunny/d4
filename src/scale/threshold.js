import "../arrays/bisect";
import "scale";

d4.scale.threshold = function() {
  return d4_scale_threshold([.5], [0, 1]);
};

function d4_scale_threshold(domain, range) {

  function scale(x) {
    return range[d4.bisect(domain, x)];
  }

  scale.domain = function(_) {
    if (!arguments.length) return domain;
    domain = _;
    return scale;
  };

  scale.range = function(_) {
    if (!arguments.length) return range;
    range = _;
    return scale;
  };

  scale.copy = function() {
    return d4_scale_threshold(domain, range);
  };

  return scale;
};
