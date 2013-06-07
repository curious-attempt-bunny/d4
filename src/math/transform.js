import "../core/document";
import "../core/ns";

d4.transform = function(string) {
  var g = d4_document.createElementNS(d4.ns.prefix.svg, "g");
  return (d4.transform = function(string) {
    if (string != null) {
      g.setAttribute("transform", string);
      var t = g.transform.baseVal.consolidate();
    }
    return new d4_transform(t ? t.matrix : d4_transformIdentity);
  })(string);
};

// Compute x-scale and normalize the first row.
// Compute shear and make second row orthogonal to first.
// Compute y-scale and normalize the second row.
// Finally, compute the rotation.
function d4_transform(m) {
  var r0 = [m.a, m.b],
      r1 = [m.c, m.d],
      kx = d4_transformNormalize(r0),
      kz = d4_transformDot(r0, r1),
      ky = d4_transformNormalize(d4_transformCombine(r1, r0, -kz)) || 0;
  if (r0[0] * r1[1] < r1[0] * r0[1]) {
    r0[0] *= -1;
    r0[1] *= -1;
    kx *= -1;
    kz *= -1;
  }
  this.rotate = (kx ? Math.atan2(r0[1], r0[0]) : Math.atan2(-r1[0], r1[1])) * d4_degrees;
  this.translate = [m.e, m.f];
  this.scale = [kx, ky];
  this.skew = ky ? Math.atan2(kz, ky) * d4_degrees : 0;
};

d4_transform.prototype.toString = function() {
  return "translate(" + this.translate
      + ")rotate(" + this.rotate
      + ")skewX(" + this.skew
      + ")scale(" + this.scale
      + ")";
};

function d4_transformDot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}

function d4_transformNormalize(a) {
  var k = Math.sqrt(d4_transformDot(a, a));
  if (k) {
    a[0] /= k;
    a[1] /= k;
  }
  return k;
}

function d4_transformCombine(a, b, k) {
  a[0] += k * b[0];
  a[1] += k * b[1];
  return a;
}

var d4_transformIdentity = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
