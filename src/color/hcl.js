import "../math/trigonometry";
import "color";
import "lab";
import "rgb";

d4.hcl = function(h, c, l) {
  return arguments.length === 1
      ? (h instanceof d4_Hcl ? d4_hcl(h.h, h.c, h.l)
      : (h instanceof d4_Lab ? d4_lab_hcl(h.l, h.a, h.b)
      : d4_lab_hcl((h = d4_rgb_lab((h = d4.rgb(h)).r, h.g, h.b)).l, h.a, h.b)))
      : d4_hcl(+h, +c, +l);
};

function d4_hcl(h, c, l) {
  return new d4_Hcl(h, c, l);
}

function d4_Hcl(h, c, l) {
  this.h = h;
  this.c = c;
  this.l = l;
}

var d4_hclPrototype = d4_Hcl.prototype = new d4_Color;

d4_hclPrototype.brighter = function(k) {
  return d4_hcl(this.h, this.c, Math.min(100, this.l + d4_lab_K * (arguments.length ? k : 1)));
};

d4_hclPrototype.darker = function(k) {
  return d4_hcl(this.h, this.c, Math.max(0, this.l - d4_lab_K * (arguments.length ? k : 1)));
};

d4_hclPrototype.rgb = function() {
  return d4_hcl_lab(this.h, this.c, this.l).rgb();
};

function d4_hcl_lab(h, c, l) {
  if (isNaN(h)) h = 0;
  if (isNaN(c)) c = 0;
  return d4_lab(l, Math.cos(h *= d4_radians) * c, Math.sin(h) * c);
}
