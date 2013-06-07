import "../core/noop";

var d4_geo_pathBoundsX0,
    d4_geo_pathBoundsY0,
    d4_geo_pathBoundsX1,
    d4_geo_pathBoundsY1;

var d4_geo_pathBounds = {
  point: d4_geo_pathBoundsPoint,
  lineStart: d4_noop,
  lineEnd: d4_noop,
  polygonStart: d4_noop,
  polygonEnd: d4_noop
};

function d4_geo_pathBoundsPoint(x, y) {
  if (x < d4_geo_pathBoundsX0) d4_geo_pathBoundsX0 = x;
  if (x > d4_geo_pathBoundsX1) d4_geo_pathBoundsX1 = x;
  if (y < d4_geo_pathBoundsY0) d4_geo_pathBoundsY0 = y;
  if (y > d4_geo_pathBoundsY1) d4_geo_pathBoundsY1 = y;
}
