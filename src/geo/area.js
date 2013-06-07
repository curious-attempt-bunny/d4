import "../core/noop";
import "../math/trigonometry";
import "geo";
import "stream";

d4.geo.area = function(object) {
  d4_geo_areaSum = 0;
  d4.geo.stream(object, d4_geo_area);
  return d4_geo_areaSum;
};

var d4_geo_areaSum,
    d4_geo_areaRingSum;

var d4_geo_area = {
  sphere: function() { d4_geo_areaSum += 4 * π; },
  point: d4_noop,
  lineStart: d4_noop,
  lineEnd: d4_noop,

  // Only count area for polygon rings.
  polygonStart: function() {
    d4_geo_areaRingSum = 0;
    d4_geo_area.lineStart = d4_geo_areaRingStart;
  },
  polygonEnd: function() {
    var area = 2 * d4_geo_areaRingSum;
    d4_geo_areaSum += area < 0 ? 4 * π + area : area;
    d4_geo_area.lineStart = d4_geo_area.lineEnd = d4_geo_area.point = d4_noop;
  }
};

function d4_geo_areaRingStart() {
  var λ00, φ00, λ0, cosφ0, sinφ0; // start point and two previous points

  // For the first point, …
  d4_geo_area.point = function(λ, φ) {
    d4_geo_area.point = nextPoint;
    λ0 = (λ00 = λ) * d4_radians, cosφ0 = Math.cos(φ = (φ00 = φ) * d4_radians / 2 + π / 4), sinφ0 = Math.sin(φ);
  };

  // For subsequent points, …
  function nextPoint(λ, φ) {
    λ *= d4_radians;
    φ = φ * d4_radians / 2 + π / 4; // half the angular distance from south pole

    // Spherical excess E for a spherical triangle with vertices: south pole,
    // previous point, current point.  Uses a formula derived from Cagnoli’s
    // theorem.  See Todhunter, Spherical Trig. (1871), Sec. 103, Eq. (2).
    var dλ = λ - λ0,
        cosφ = Math.cos(φ),
        sinφ = Math.sin(φ),
        k = sinφ0 * sinφ,
        u = cosφ0 * cosφ + k * Math.cos(dλ),
        v = k * Math.sin(dλ);
    d4_geo_areaRingSum += Math.atan2(v, u);

    // Advance the previous points.
    λ0 = λ, cosφ0 = cosφ, sinφ0 = sinφ;
  }

  // For the last point, return to the start.
  d4_geo_area.lineEnd = function() {
    nextPoint(λ00, φ00);
  };
}
