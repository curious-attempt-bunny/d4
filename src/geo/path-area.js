import "../core/noop";

// TODO Unify this code with d4.geom.polygon area?

var d4_geo_pathAreaSum, d4_geo_pathAreaPolygon, d4_geo_pathArea = {
  point: d4_noop,
  lineStart: d4_noop,
  lineEnd: d4_noop,

  // Only count area for polygon rings.
  polygonStart: function() {
    d4_geo_pathAreaPolygon = 0;
    d4_geo_pathArea.lineStart = d4_geo_pathAreaRingStart;
  },
  polygonEnd: function() {
    d4_geo_pathArea.lineStart = d4_geo_pathArea.lineEnd = d4_geo_pathArea.point = d4_noop;
    d4_geo_pathAreaSum += Math.abs(d4_geo_pathAreaPolygon / 2);
  }
};

function d4_geo_pathAreaRingStart() {
  var x00, y00, x0, y0;

  // For the first point, …
  d4_geo_pathArea.point = function(x, y) {
    d4_geo_pathArea.point = nextPoint;
    x00 = x0 = x, y00 = y0 = y;
  };

  // For subsequent points, …
  function nextPoint(x, y) {
    d4_geo_pathAreaPolygon += y0 * x - x0 * y;
    x0 = x, y0 = y;
  }

  // For the last point, return to the start.
  d4_geo_pathArea.lineEnd = function() {
    nextPoint(x00, y00);
  };
}
