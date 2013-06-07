import "linear";
import "nice";
import "scale";

d4.scale.pow = function() {
  return d4_scale_pow(d4.scale.linear(), 1, [0, 1]);
};

function d4_scale_pow(linear, exponent, domain) {
  var powp = d4_scale_powPow(exponent),
      powb = d4_scale_powPow(1 / exponent);

  function scale(x) {
    return linear(powp(x));
  }

  scale.invert = function(x) {
    return powb(linear.invert(x));
  };

  scale.domain = function(x) {
    if (!arguments.length) return domain;
    linear.domain((domain = x.map(Number)).map(powp));
    return scale;
  };

  scale.ticks = function(m) {
    return d4_scale_linearTicks(domain, m);
  };

  scale.tickFormat = function(m, format) {
    return d4_scale_linearTickFormat(domain, m, format);
  };

  scale.nice = function() {
    return scale.domain(d4_scale_nice(domain, d4_scale_linearNice));
  };

  scale.exponent = function(x) {
    if (!arguments.length) return exponent;
    powp = d4_scale_powPow(exponent = x);
    powb = d4_scale_powPow(1 / exponent);
    linear.domain(domain.map(powp));
    return scale;
  };

  scale.copy = function() {
    return d4_scale_pow(linear.copy(), exponent, domain);
  };

  return d4_scale_linearRebind(scale, linear);
}

function d4_scale_powPow(e) {
  return function(x) {
    return x < 0 ? -Math.pow(-x, e) : Math.pow(x, e);
  };
}
