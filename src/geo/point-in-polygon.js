import "geo";
import "area";
import "cartesian";
import "../math/trigonometry";

d3.geo.pointInPolygon = d3_geo_pointInPolygon;

function d3_geo_pointInPolygon(point, polygon) {
  var point0,
      meridian = point[0],
      parallel = point[1],
      meridianNormal = [Math.sin(meridian), -Math.cos(meridian), 0],
      polarAngle = 0,
      polar = false,
      southPole = false,
      winding = 0;

  d3_geo_area.polygonStart();
  for (var i = 0, n = polygon.length; i < n; ++i) {
    var ring = polygon[i],
        m = ring.length;
    if (!m) continue;
    point0 = point = ring[0];
    var λ0 = point[0],
        φ0 = point[1],
        j = 1;
    d3_geo_area.lineStart();
    d3_geo_area.point(λ0 * d3_degrees, φ0 * d3_degrees);
    while (true) {
      if (j === m) j = 0;

      point = ring[j];
      var λ = point[0],
          φ = point[1],
          angle = λ - λ0,
          antimeridian = Math.abs(angle) > π;

      if (Math.abs(φ + π / 2) < ε) southPole = true;

      polarAngle += antimeridian ? angle + (angle >= 0 ? 2 : -2) * π : angle;

      // Are the longitudes either side of the point's meridian, and are the
      // latitudes smaller than the parallel?
      if (antimeridian ^ λ0 >= meridian ^ λ >= meridian) {
        var arc = d3_geo_cartesianCross(d3_geo_cartesian(point0), d3_geo_cartesian(point));
        d3_geo_cartesianNormalize(arc);
        var intersection = d3_geo_cartesianCross(meridianNormal, arc);
        d3_geo_cartesianNormalize(intersection);
        var φarc = (antimeridian ^ angle >= 0 ? -1 : 1) * d3_asin(intersection[2]);
        if (parallel > φarc) {
          winding += antimeridian ^ angle >= 0 ? 1 : -1;
        }
      }
      if (j++) d3_geo_area.point((λ0 = λ) * d3_degrees, (φ0 = φ) * d3_degrees), point0 = point;
      else break;
    }
    d3_geo_area.lineEnd();
    if (Math.abs(polarAngle) > ε) polar = true;
  }
  d3_geo_area.polygonEnd();

  // First, determine whether the South pole is inside or outside:
  //
  // It is inside if:
  // * the polygon doesn't wind around it, and its area is negative (counter-clockwise).
  // * otherwise, if the polygon winds around it in a clockwise direction.
  //
  // Second, count the (signed) number of times a segment crosses a meridian
  // from the point to the South pole.  If it is zero, then the point is the
  // same side as the South pole.

  return (!southPole && !polar && d3_geo_areaRingSum < 0 || polarAngle < -ε) ^ (winding & 1);
}
