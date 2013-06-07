import "../format/format";
import "linear";
import "nice";
import "scale";

d4.scale.log = function() {
  return d4_scale_log(d4.scale.linear().domain([0, Math.LN10]), 10, d4_scale_logp, d4_scale_powp, [1, 10]);
};

function d4_scale_log(linear, base, log, pow, domain) {

  function scale(x) {
    return linear(log(x));
  }

  scale.invert = function(x) {
    return pow(linear.invert(x));
  };

  scale.domain = function(x) {
    if (!arguments.length) return domain;
    if (x[0] < 0) log = d4_scale_logn, pow = d4_scale_pown;
    else log = d4_scale_logp, pow = d4_scale_powp;
    linear.domain((domain = x.map(Number)).map(log));
    return scale;
  };

  scale.base = function(_) {
    if (!arguments.length) return base;
    base = +_;
    return scale;
  };

  scale.nice = function() {
    linear.domain(d4_scale_nice(domain, nice).map(log));
    return scale;
  };

  scale.ticks = function() {
    var extent = d4_scaleExtent(linear.domain()),
        ticks = [];
    if (extent.every(isFinite)) {
      var b = Math.log(base),
          i = Math.floor(extent[0] / b),
          j = Math.ceil(extent[1] / b),
          u = pow(extent[0]),
          v = pow(extent[1]),
          n = base % 1 ? 2 : base;
      if (log === d4_scale_logn) {
        ticks.push(-Math.pow(base, -i));
        for (; i++ < j;) for (var k = n - 1; k > 0; k--) ticks.push(-Math.pow(base, -i) * k);
      } else {
        for (; i < j; i++) for (var k = 1; k < n; k++) ticks.push(Math.pow(base, i) * k);
        ticks.push(Math.pow(base, i));
      }
      for (i = 0; ticks[i] < u; i++) {} // strip small values
      for (j = ticks.length; ticks[j - 1] > v; j--) {} // strip big values
      ticks = ticks.slice(i, j);
    }
    return ticks;
  };

  scale.tickFormat = function(n, format) {
    if (arguments.length < 2) format = d4_scale_logFormat;
    if (!arguments.length) return format;
    var b = Math.log(base),
        k = Math.max(.1, n / scale.ticks().length),
        f = log === d4_scale_logn ? (e = -1e-12, Math.floor) : (e = 1e-12, Math.ceil),
        e;
    return function(d) {
      return d / pow(b * f(log(d) / b + e)) <= k ? format(d) : "";
    };
  };

  scale.copy = function() {
    return d4_scale_log(linear.copy(), base, log, pow, domain);
  };

  function nice() {
    return log === d4_scale_logp
        ? {floor: floor, ceil: ceil}
        : {floor: function(x) { return -ceil(-x); }, ceil: function(x) { return -floor(-x); }};
  }

  function floor(x) {
    return Math.pow(base, Math.floor(Math.log(x) / Math.log(base)));
  }

  function ceil(x) {
    return Math.pow(base, Math.ceil(Math.log(x) / Math.log(base)));
  }

  return d4_scale_linearRebind(scale, linear);
}

var d4_scale_logFormat = d4.format(".0e");

function d4_scale_logp(x) {
  return Math.log(x < 0 ? 0 : x);
}

function d4_scale_powp(x) {
  return Math.exp(x);
}

function d4_scale_logn(x) {
  return -Math.log(x > 0 ? 0 : -x);
}

function d4_scale_pown(x) {
  return -Math.exp(-x);
}
