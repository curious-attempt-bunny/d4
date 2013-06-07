import "../core/noop";
import "../math/trigonometry";
import "geo";
import "stream";

d4.geo.length = function(object) {
  d4_geo_lengthSum = 0;
  d4.geo.stream(object, d4_geo_length);
  return d4_geo_lengthSum;
};

var d4_geo_lengthSum;

var d4_geo_length = {
  sphere: d4_noop,
  point: d4_noop,
  lineStart: d4_geo_lengthLineStart,
  lineEnd: d4_noop,
  polygonStart: d4_noop,
  polygonEnd: d4_noop
};

function d4_geo_lengthLineStart() {
  var λ0, sinφ0, cosφ0;

  d4_geo_length.point = function(λ, φ) {
    λ0 = λ * d4_radians, sinφ0 = Math.sin(φ *= d4_radians), cosφ0 = Math.cos(φ);
    d4_geo_length.point = nextPoint;
  };

  d4_geo_length.lineEnd = function() {
    d4_geo_length.point = d4_geo_length.lineEnd = d4_noop;
  };

  function nextPoint(λ, φ) {
    var sinφ = Math.sin(φ *= d4_radians),
        cosφ = Math.cos(φ),
        t = Math.abs((λ *= d4_radians) - λ0),
        cosΔλ = Math.cos(t);
    d4_geo_lengthSum += Math.atan2(Math.sqrt((t = cosφ * Math.sin(t)) * t + (t = cosφ0 * sinφ - sinφ0 * cosφ * cosΔλ) * t), sinφ0 * sinφ + cosφ0 * cosφ * cosΔλ);
    λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ;
  }
}
