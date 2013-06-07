import "linear";
import "scale";

d4.scale.identity = function() {
  return d4_scale_identity([0, 1]);
};

function d4_scale_identity(domain) {

  function identity(x) { return +x; }

  identity.invert = identity;

  identity.domain = identity.range = function(x) {
    if (!arguments.length) return domain;
    domain = x.map(identity);
    return identity;
  };

  identity.ticks = function(m) {
    return d4_scale_linearTicks(domain, m);
  };

  identity.tickFormat = function(m, format) {
    return d4_scale_linearTickFormat(domain, m, format);
  };

  identity.copy = function() {
    return d4_scale_identity(domain);
  };

  return identity;
}
