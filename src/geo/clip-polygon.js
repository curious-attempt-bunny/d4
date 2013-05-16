import "clip";
import "distance";
import "intersect";
import "point-in-polygon";
import "spherical";

function d3_geo_clipPolygon(polygon) {
  var segments = [];

  polygon = polygon.map(function(ring) {
    var cartesian0;
    ring = ring.map(function(point, i) {
      var cartesian = d3_geo_cartesian(point = [point[0] * d3_radians, point[1] * d3_radians]);
      if (i) segments.push([cartesian0, cartesian]);
      cartesian0 = cartesian;
      return point;
    });
    ring.pop();
    return ring;
  });

  var point = polygon[0][0];

  return d3_geo_clip(visible, clipLine, interpolate, polygonContains, d3_geo_clipPolygonSort);

  function visible(λ, φ) {
    return d3_geo_pointInPolygon([λ, φ], polygon);
  }

  function clipLine(listener) {
    var point0,
        λ00,
        φ00,
        v00,
        v0,
        clean;
    return {
      lineStart: function() {
        point0 = null;
        clean = 1;
      },
      point: function(λ, φ, close) {
        if (close) λ = λ00, φ = φ00;
        var point = d3_geo_cartesian([λ, φ]),
            v = v0;
        if (point0) {
          var segment = [point0, point],
              intersections = [];
          for (var i = 0, j = 100; i < segments.length && j > 0; ++i) {
            var s = segments[i],
                intersection = d3_geo_intersect(segment, s);
            if (intersection) {
              if (intersection === d3_geo_intersectCoincident ||
                  d3_geo_cartesianEqual(intersection, point0) || d3_geo_cartesianEqual(intersection, point) ||
                  d3_geo_cartesianEqual(intersection, s[0]) || d3_geo_cartesianEqual(intersection, s[1])) {
                var t = 1e-4;
                λ = (λ + 3 * π + (Math.random() < .5 ? t : -t)) % (2 * π) - π;
                φ = Math.min(π / 2 - 1e-4, Math.max(1e-4 - π / 2, φ + (Math.random() < .5 ? t : -t)));
                segment[1] = point = d3_geo_cartesian([λ, φ]);
                i = -1, --j;
                intersections.length = 0;
                continue;
              }
              var spherical = d3_geo_spherical(intersection);
              intersection.distance = d3_geo_clipPolygonDistance(point0, intersection);
              intersection.index = i;
              intersection.t = d3_geo_clipPolygonDistance(s[0], intersection);
              intersection[0] = spherical[0], intersection[1] = spherical[1], intersection.pop();
              intersections.push(intersection);
            }
          }
          if (intersections.length) {
            clean = 0;
            intersections.sort(function(a, b) { return a.distance - b.distance; });
            for (var i = 0; i < intersections.length; ++i) {
              var intersection = intersections[i];
              if (v = !v) {
                listener.lineStart();
                listener.point(intersection[0], intersection[1], intersection.index, intersection.t);
              } else {
                listener.point(intersection[0], intersection[1], intersection.index, intersection.t);
                listener.lineEnd();
              }
            }
          }
          if (v) listener.point(λ, φ);
        } else {
          for (var i = 0, j = 100; i < segments.length && j > 0; ++i) {
            var s = segments[i];
            if (d3_geo_intersectPointOnLine(point, s)) {
              var t = 1e-4;
              λ = (λ + 3 * π + (Math.random() < .5 ? t : -t)) % (2 * π) - π;
              φ = Math.min(π / 2 - 1e-4, Math.max(1e-4 - π / 2, φ + (Math.random() < .5 ? t : -t)));
              point = d3_geo_cartesian([λ, φ]);
              i = -1, --j;
            }
          }
          if (v00 = v = visible(λ00 = λ, φ00 = φ)) listener.lineStart(), listener.point(λ, φ);
        }
        point0 = point, v0 = v;
      },
      lineEnd: function() {
        if (v0) listener.lineEnd();
      },
      // Rejoin first and last segments if there were intersections and the first
      // and last points were visible.
      clean: function() {
        return clean | ((v00 && v0) << 1);
      }
    };
  }

  function interpolate(from, to, direction, listener) {
    if (from == null) {
      var n = polygon.length;
      polygon.forEach(function(ring, i) {
        ring.forEach(function(point) { listener.point(point[0], point[1]); });
        if (i < n - 1) listener.lineEnd(), listener.lineStart();
      });
    } else if (from.index !== to.index && from.index != null && to.index != null) {
      for (var i = from.index; i !== to.index; i = (i + direction + segments.length) % segments.length) {
        var segment = segments[i],
            point = d3_geo_spherical(direction > 0 ? segment[1] : segment[0]);
        listener.point(point[0], point[1]);
      }
    }
  }

  function polygonContains(polygon) {
    return d3_geo_pointInPolygon(point, polygon);
  }
}

function d3_geo_clipPolygonSort(a, b) {
  a = a.point, b = b.point;
  return a.index - b.index || a.t - b.t;
}

// Geodesic coordinates for two 3D points.
function d3_geo_clipPolygonDistance(a, b) {
  var axb = d3_geo_cartesianCross(a, b);
  return Math.atan2(Math.sqrt(d3_geo_cartesianDot(axb, axb)), d3_geo_cartesianDot(a, b));
}
