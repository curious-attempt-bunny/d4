import "../color/rgb";

d4.interpolateRgb = d4_interpolateRgb;

function d4_interpolateRgb(a, b) {
  a = d4.rgb(a);
  b = d4.rgb(b);
  var ar = a.r,
      ag = a.g,
      ab = a.b,
      br = b.r - ar,
      bg = b.g - ag,
      bb = b.b - ab;
  return function(t) {
    return "#"
        + d4_rgb_hex(Math.round(ar + br * t))
        + d4_rgb_hex(Math.round(ag + bg * t))
        + d4_rgb_hex(Math.round(ab + bb * t));
  };
}
