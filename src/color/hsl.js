import "color";
import "rgb";

d4.hsl = function(h, s, l) {
  return arguments.length === 1
      ? (h instanceof d4_Hsl ? d4_hsl(h.h, h.s, h.l)
      : d4_rgb_parse("" + h, d4_rgb_hsl, d4_hsl))
      : d4_hsl(+h, +s, +l);
};

function d4_hsl(h, s, l) {
  return new d4_Hsl(h, s, l);
}

function d4_Hsl(h, s, l) {
  this.h = h;
  this.s = s;
  this.l = l;
}

var d4_hslPrototype = d4_Hsl.prototype = new d4_Color;

d4_hslPrototype.brighter = function(k) {
  k = Math.pow(0.7, arguments.length ? k : 1);
  return d4_hsl(this.h, this.s, this.l / k);
};

d4_hslPrototype.darker = function(k) {
  k = Math.pow(0.7, arguments.length ? k : 1);
  return d4_hsl(this.h, this.s, k * this.l);
};

d4_hslPrototype.rgb = function() {
  return d4_hsl_rgb(this.h, this.s, this.l);
};

function d4_hsl_rgb(h, s, l) {
  var m1,
      m2;

  /* Some simple corrections for h, s and l. */
  h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;
  s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;
  l = l < 0 ? 0 : l > 1 ? 1 : l;

  /* From FvD 13.37, CSS Color Module Level 3 */
  m2 = l <= .5 ? l * (1 + s) : l + s - l * s;
  m1 = 2 * l - m2;

  function v(h) {
    if (h > 360) h -= 360;
    else if (h < 0) h += 360;
    if (h < 60) return m1 + (m2 - m1) * h / 60;
    if (h < 180) return m2;
    if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;
    return m1;
  }

  function vv(h) {
    return Math.round(v(h) * 255);
  }

  return d4_rgb(vv(h + 120), vv(h), vv(h - 120));
}
