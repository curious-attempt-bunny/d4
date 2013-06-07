import "../arrays/map";
import "../core/identity";
import "../math/trigonometry";

var d4_ease_default = function() { return d4_identity; };

var d4_ease = d4.map({
  linear: d4_ease_default,
  poly: d4_ease_poly,
  quad: function() { return d4_ease_quad; },
  cubic: function() { return d4_ease_cubic; },
  sin: function() { return d4_ease_sin; },
  exp: function() { return d4_ease_exp; },
  circle: function() { return d4_ease_circle; },
  elastic: d4_ease_elastic,
  back: d4_ease_back,
  bounce: function() { return d4_ease_bounce; }
});

var d4_ease_mode = d4.map({
  "in": d4_identity,
  "out": d4_ease_reverse,
  "in-out": d4_ease_reflect,
  "out-in": function(f) { return d4_ease_reflect(d4_ease_reverse(f)); }
});

d4.ease = function(name) {
  var i = name.indexOf("-"),
      t = i >= 0 ? name.substring(0, i) : name,
      m = i >= 0 ? name.substring(i + 1) : "in";
  t = d4_ease.get(t) || d4_ease_default;
  m = d4_ease_mode.get(m) || d4_identity;
  return d4_ease_clamp(m(t.apply(null, Array.prototype.slice.call(arguments, 1))));
};

function d4_ease_clamp(f) {
  return function(t) {
    return t <= 0 ? 0 : t >= 1 ? 1 : f(t);
  };
}

function d4_ease_reverse(f) {
  return function(t) {
    return 1 - f(1 - t);
  };
}

function d4_ease_reflect(f) {
  return function(t) {
    return .5 * (t < .5 ? f(2 * t) : (2 - f(2 - 2 * t)));
  };
}

function d4_ease_quad(t) {
  return t * t;
}

function d4_ease_cubic(t) {
  return t * t * t;
}

// Optimized clamp(reflect(poly(3))).
function d4_ease_cubicInOut(t) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  var t2 = t * t, t3 = t2 * t;
  return 4 * (t < .5 ? t3 : 3 * (t - t2) + t3 - .75);
}

function d4_ease_poly(e) {
  return function(t) {
    return Math.pow(t, e);
  };
}

function d4_ease_sin(t) {
  return 1 - Math.cos(t * π / 2);
}

function d4_ease_exp(t) {
  return Math.pow(2, 10 * (t - 1));
}

function d4_ease_circle(t) {
  return 1 - Math.sqrt(1 - t * t);
}

function d4_ease_elastic(a, p) {
  var s;
  if (arguments.length < 2) p = 0.45;
  if (arguments.length) s = p / (2 * π) * Math.asin(1 / a);
  else a = 1, s = p / 4;
  return function(t) {
    return 1 + a * Math.pow(2, 10 * -t) * Math.sin((t - s) * 2 * π / p);
  };
}

function d4_ease_back(s) {
  if (!s) s = 1.70158;
  return function(t) {
    return t * t * ((s + 1) * t - s);
  };
}

function d4_ease_bounce(t) {
  return t < 1 / 2.75 ? 7.5625 * t * t
      : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75
      : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375
      : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
}
