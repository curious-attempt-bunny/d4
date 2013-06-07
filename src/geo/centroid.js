import "../math/trigonometry";
import "geo";
import "stream";

d4.geo.centroid = function(object) {
  d4_geo_centroidDimension = d4_geo_centroidW = d4_geo_centroidX = d4_geo_centroidY = d4_geo_centroidZ = 0;
  d4.geo.stream(object, d4_geo_centroid);
  var m;
  if (d4_geo_centroidW &&
      Math.abs(m = Math.sqrt(d4_geo_centroidX * d4_geo_centroidX + d4_geo_centroidY * d4_geo_centroidY + d4_geo_centroidZ * d4_geo_centroidZ)) > ε) {
    return [
      Math.atan2(d4_geo_centroidY, d4_geo_centroidX) * d4_degrees,
      Math.asin(Math.max(-1, Math.min(1, d4_geo_centroidZ / m))) * d4_degrees
    ];
  }
};

var d4_geo_centroidDimension,
    d4_geo_centroidW,
    d4_geo_centroidX,
    d4_geo_centroidY,
    d4_geo_centroidZ;

var d4_geo_centroid = {
  sphere: function() {
    if (d4_geo_centroidDimension < 2) {
      d4_geo_centroidDimension = 2;
      d4_geo_centroidW = d4_geo_centroidX = d4_geo_centroidY = d4_geo_centroidZ = 0;
    }
  },
  point: d4_geo_centroidPoint,
  lineStart: d4_geo_centroidLineStart,
  lineEnd: d4_geo_centroidLineEnd,
  polygonStart: function() {
    if (d4_geo_centroidDimension < 2) {
      d4_geo_centroidDimension = 2;
      d4_geo_centroidW = d4_geo_centroidX = d4_geo_centroidY = d4_geo_centroidZ = 0;
    }
    d4_geo_centroid.lineStart = d4_geo_centroidRingStart;
  },
  polygonEnd: function() {
    d4_geo_centroid.lineStart = d4_geo_centroidLineStart;
  }
};

// Arithmetic mean of Cartesian vectors.
function d4_geo_centroidPoint(λ, φ) {
  if (d4_geo_centroidDimension) return;
  ++d4_geo_centroidW;
  λ *= d4_radians;
  var cosφ = Math.cos(φ *= d4_radians);
  d4_geo_centroidX += (cosφ * Math.cos(λ) - d4_geo_centroidX) / d4_geo_centroidW;
  d4_geo_centroidY += (cosφ * Math.sin(λ) - d4_geo_centroidY) / d4_geo_centroidW;
  d4_geo_centroidZ += (Math.sin(φ) - d4_geo_centroidZ) / d4_geo_centroidW;
}

function d4_geo_centroidRingStart() {
  var λ00, φ00; // first point

  d4_geo_centroidDimension = 1;
  d4_geo_centroidLineStart();
  d4_geo_centroidDimension = 2;

  var linePoint = d4_geo_centroid.point;
  d4_geo_centroid.point = function(λ, φ) {
    linePoint(λ00 = λ, φ00 = φ);
  };
  d4_geo_centroid.lineEnd = function() {
    d4_geo_centroid.point(λ00, φ00);
    d4_geo_centroidLineEnd();
    d4_geo_centroid.lineEnd = d4_geo_centroidLineEnd;
  };
}

function d4_geo_centroidLineStart() {
  var x0, y0, z0; // previous point

  if (d4_geo_centroidDimension > 1) return;
  if (d4_geo_centroidDimension < 1) {
    d4_geo_centroidDimension = 1;
    d4_geo_centroidW = d4_geo_centroidX = d4_geo_centroidY = d4_geo_centroidZ = 0;
  }

  d4_geo_centroid.point = function(λ, φ) {
    λ *= d4_radians;
    var cosφ = Math.cos(φ *= d4_radians);
    x0 = cosφ * Math.cos(λ);
    y0 = cosφ * Math.sin(λ);
    z0 = Math.sin(φ);
    d4_geo_centroid.point = nextPoint;
  };

  function nextPoint(λ, φ) {
    λ *= d4_radians;
    var cosφ = Math.cos(φ *= d4_radians),
        x = cosφ * Math.cos(λ),
        y = cosφ * Math.sin(λ),
        z = Math.sin(φ),
        w = Math.atan2(
          Math.sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w),
          x0 * x + y0 * y + z0 * z);
    d4_geo_centroidW += w;
    d4_geo_centroidX += w * (x0 + (x0 = x));
    d4_geo_centroidY += w * (y0 + (y0 = y));
    d4_geo_centroidZ += w * (z0 + (z0 = z));
  }
}

function d4_geo_centroidLineEnd() {
  d4_geo_centroid.point = d4_geo_centroidPoint;
}
