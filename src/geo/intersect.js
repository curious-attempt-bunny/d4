import "../math/trigonometry";
import "cartesian";
import "spherical";

function d3_geo_intersect(a, b) {
  var a0 = a[0],
      a1 = a[1],
      b0 = b[0],
      b1 = b[1];

  a = d3_geo_cartesianCross(a0, a1);
  b = d3_geo_cartesianCross(b0, b1);
  a0 = d3_geo_cartesianCross(a, a0);
  a1 = d3_geo_cartesianCross(a, a1);
  b0 = d3_geo_cartesianCross(b, b0);
  b1 = d3_geo_cartesianCross(b, b1);

  var axb = d3_geo_cartesianCross(a, b);
  d3_geo_cartesianNormalize(axb);
  if (isNaN(axb[0])) {
    var candidates = a.concat(b);
    for (var i = 0; i < 4; ++i) {
      axb = candidates[i];
      a0 = d3_geo_cartesianDot(axb, a0);
      a1 = d3_geo_cartesianDot(axb, a1);
      b0 = d3_geo_cartesianDot(axb, b0);
      b1 = d3_geo_cartesianDot(axb, b1);

      if (a0 > -ε2 && a1 < ε2 && b0 > -ε2 && b1 < ε2) return d3_geo_intersectCoincident;

      if (a0 < ε2 && a1 > -ε2 && b0 < ε2 && b1 > -ε2) {
        axb[0] = -axb[0], axb[1] = -axb[1], axb[2] = -axb[2];
        return d3_geo_intersectCoincident;
      }
    }
  } else {
    a0 = d3_geo_cartesianDot(axb, a0);
    a1 = d3_geo_cartesianDot(axb, a1);
    b0 = d3_geo_cartesianDot(axb, b0);
    b1 = d3_geo_cartesianDot(axb, b1);

    if (a0 > -ε2 && a1 < ε2 && b0 > -ε2 && b1 < ε2) return axb;

    if (a0 < ε2 && a1 > -ε2 && b0 < ε2 && b1 > -ε2) {
      axb[0] = -axb[0], axb[1] = -axb[1], axb[2] = -axb[2];
      return axb;
    }
  }
}

function d3_geo_intersectPointOnLine(p, a) {
  var a0 = a[0],
      a1 = a[1];
  a = d3_geo_cartesianCross(a0, a1);
  a0 = d3_geo_cartesianCross(a, a0);
  a1 = d3_geo_cartesianCross(a, a1);
  a0 = d3_geo_cartesianDot(p, a0);
  a1 = d3_geo_cartesianDot(p, a1);
  p = d3_geo_cartesianDot(p, a);

  return Math.abs(p) < ε2 && (a0 > -ε2 && a1 < ε2 || a0 < ε2 && a1 > -ε2);
}

var d3_geo_intersectCoincident = {};
