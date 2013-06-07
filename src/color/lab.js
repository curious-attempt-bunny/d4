import "../math/trigonometry";
import "color";
import "hcl";
import "rgb";

d4.lab = function(l, a, b) {
  return arguments.length === 1
      ? (l instanceof d4_Lab ? d4_lab(l.l, l.a, l.b)
      : (l instanceof d4_Hcl ? d4_hcl_lab(l.l, l.c, l.h)
      : d4_rgb_lab((l = d4.rgb(l)).r, l.g, l.b)))
      : d4_lab(+l, +a, +b);
};

function d4_lab(l, a, b) {
  return new d4_Lab(l, a, b);
}

function d4_Lab(l, a, b) {
  this.l = l;
  this.a = a;
  this.b = b;
}

// Corresponds roughly to RGB brighter/darker
var d4_lab_K = 18;

// D65 standard referent
var d4_lab_X = 0.950470,
    d4_lab_Y = 1,
    d4_lab_Z = 1.088830;

var d4_labPrototype = d4_Lab.prototype = new d4_Color;

d4_labPrototype.brighter = function(k) {
  return d4_lab(Math.min(100, this.l + d4_lab_K * (arguments.length ? k : 1)), this.a, this.b);
};

d4_labPrototype.darker = function(k) {
  return d4_lab(Math.max(0, this.l - d4_lab_K * (arguments.length ? k : 1)), this.a, this.b);
};

d4_labPrototype.rgb = function() {
  return d4_lab_rgb(this.l, this.a, this.b);
};

function d4_lab_rgb(l, a, b) {
  var y = (l + 16) / 116,
      x = y + a / 500,
      z = y - b / 200;
  x = d4_lab_xyz(x) * d4_lab_X;
  y = d4_lab_xyz(y) * d4_lab_Y;
  z = d4_lab_xyz(z) * d4_lab_Z;
  return d4_rgb(
    d4_xyz_rgb( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z),
    d4_xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
    d4_xyz_rgb( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z)
  );
}

function d4_lab_hcl(l, a, b) {
  return l > 0
      ? d4_hcl(Math.atan2(b, a) * d4_degrees, Math.sqrt(a * a + b * b), l)
      : d4_hcl(NaN, NaN, l);
}

function d4_lab_xyz(x) {
  return x > 0.206893034 ? x * x * x : (x - 4 / 29) / 7.787037;
}
