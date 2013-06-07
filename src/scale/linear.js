import "../arrays/range";
import "../core/rebind";
import "../interpolate/interpolate";
import "../interpolate/round";
import "../interpolate/uninterpolate";
import "../format/format";
import "bilinear";
import "nice";
import "polylinear";
import "scale";

d4.scale.linear = function() {
  return d4_scale_linear([0, 1], [0, 1], d4_interpolate, false);
};

function d4_scale_linear(domain, range, interpolate, clamp) {
  var output,
      input;

  function rescale() {
    var linear = Math.min(domain.length, range.length) > 2 ? d4_scale_polylinear : d4_scale_bilinear,
        uninterpolate = clamp ? d4_uninterpolateClamp : d4_uninterpolateNumber;
    output = linear(domain, range, uninterpolate, interpolate);
    input = linear(range, domain, uninterpolate, d4_interpolate);
    return scale;
  }

  function scale(x) {
    return output(x);
  }

  // Note: requires range is coercible to number!
  scale.invert = function(y) {
    return input(y);
  };

  scale.domain = function(x) {
    if (!arguments.length) return domain;
    domain = x.map(Number);
    return rescale();
  };

  scale.range = function(x) {
    if (!arguments.length) return range;
    range = x;
    return rescale();
  };

  scale.rangeRound = function(x) {
    return scale.range(x).interpolate(d4_interpolateRound);
  };

  scale.clamp = function(x) {
    if (!arguments.length) return clamp;
    clamp = x;
    return rescale();
  };

  scale.interpolate = function(x) {
    if (!arguments.length) return interpolate;
    interpolate = x;
    return rescale();
  };

  scale.ticks = function(m) {
    return d4_scale_linearTicks(domain, m);
  };

  scale.tickFormat = function(m, format) {
    return d4_scale_linearTickFormat(domain, m, format);
  };

  scale.nice = function() {
    d4_scale_nice(domain, d4_scale_linearNice);
    return rescale();
  };

  scale.copy = function() {
    return d4_scale_linear(domain, range, interpolate, clamp);
  };

  return rescale();
}

function d4_scale_linearRebind(scale, linear) {
  return d4.rebind(scale, linear, "range", "rangeRound", "interpolate", "clamp");
}

function d4_scale_linearNice(dx) {
  dx = Math.pow(10, Math.round(Math.log(dx) / Math.LN10) - 1);
  return dx && {
    floor: function(x) { return Math.floor(x / dx) * dx; },
    ceil: function(x) { return Math.ceil(x / dx) * dx; }
  };
}

function d4_scale_linearTickRange(domain, m) {
  var extent = d4_scaleExtent(domain),
      span = extent[1] - extent[0],
      step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)),
      err = m / span * step;

  // Filter ticks to get closer to the desired count.
  if (err <= .15) step *= 10;
  else if (err <= .35) step *= 5;
  else if (err <= .75) step *= 2;

  // Round start and stop values to step interval.
  extent[0] = Math.ceil(extent[0] / step) * step;
  extent[1] = Math.floor(extent[1] / step) * step + step * .5; // inclusive
  extent[2] = step;
  return extent;
}

function d4_scale_linearTicks(domain, m) {
  return d4.range.apply(d4, d4_scale_linearTickRange(domain, m));
}

function d4_scale_linearTickFormat(domain, m, format) {
  var precision = -Math.floor(Math.log(d4_scale_linearTickRange(domain, m)[2]) / Math.LN10 + .01);
  return d4.format(format
      ? format.replace(d4_format_re, function(a, b, c, d, e, f, g, h, i, j) { return [b, c, d, e, f, g, h, i || "." + (precision - (j === "%") * 2), j].join(""); })
      : ",." + precision + "f");
}
