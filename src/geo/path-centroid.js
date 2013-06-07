import "centroid";

// TODO Unify this code with d4.geom.polygon centroid?
// TODO Enforce positive area for exterior, negative area for interior?

var d4_geo_pathCentroid = {
  point: d4_geo_pathCentroidPoint,

  // For lines, weight by length.
  lineStart: d4_geo_pathCentroidLineStart,
  lineEnd: d4_geo_pathCentroidLineEnd,

  // For polygons, weight by area.
  polygonStart: function() {
    d4_geo_pathCentroid.lineStart = d4_geo_pathCentroidRingStart;
  },
  polygonEnd: function() {
    d4_geo_pathCentroid.point = d4_geo_pathCentroidPoint;
    d4_geo_pathCentroid.lineStart = d4_geo_pathCentroidLineStart;
    d4_geo_pathCentroid.lineEnd = d4_geo_pathCentroidLineEnd;
  }
};

function d4_geo_pathCentroidPoint(x, y) {
  if (d4_geo_centroidDimension) return;
  d4_geo_centroidX += x;
  d4_geo_centroidY += y;
  ++d4_geo_centroidZ;
}

function d4_geo_pathCentroidLineStart() {
  var x0, y0;

  if (d4_geo_centroidDimension !== 1) {
    if (d4_geo_centroidDimension < 1) {
      d4_geo_centroidDimension = 1;
      d4_geo_centroidX = d4_geo_centroidY = d4_geo_centroidZ = 0;
    } else return;
  }

  d4_geo_pathCentroid.point = function(x, y) {
    d4_geo_pathCentroid.point = nextPoint;
    x0 = x, y0 = y;
  };

  function nextPoint(x, y) {
    var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
    d4_geo_centroidX += z * (x0 + x) / 2;
    d4_geo_centroidY += z * (y0 + y) / 2;
    d4_geo_centroidZ += z;
    x0 = x, y0 = y;
  }
}

function d4_geo_pathCentroidLineEnd() {
  d4_geo_pathCentroid.point = d4_geo_pathCentroidPoint;
}

function d4_geo_pathCentroidRingStart() {
  var x00, y00, x0, y0;

  if (d4_geo_centroidDimension < 2) {
    d4_geo_centroidDimension = 2;
    d4_geo_centroidX = d4_geo_centroidY = d4_geo_centroidZ = 0;
  }

  // For the first point, …
  d4_geo_pathCentroid.point = function(x, y) {
    d4_geo_pathCentroid.point = nextPoint;
    x00 = x0 = x, y00 = y0 = y;
  };

  // For subsequent points, …
  function nextPoint(x, y) {
    var z = y0 * x - x0 * y;
    d4_geo_centroidX += z * (x0 + x);
    d4_geo_centroidY += z * (y0 + y);
    d4_geo_centroidZ += z * 3;
    x0 = x, y0 = y;
  }

  // For the last point, return to the start.
  d4_geo_pathCentroid.lineEnd = function() {
    nextPoint(x00, y00);
  };
}
