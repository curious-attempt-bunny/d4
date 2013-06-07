import "../core/identity";
import "../math/trigonometry";
import "albers-usa";
import "area";
import "bounds";
import "centroid";
import "geo";
import "path-area";
import "path-bounds";
import "path-buffer";
import "path-centroid";
import "path-context";
import "projection";
import "resample";
import "stream";

d4.geo.path = function() {
  var pointRadius = 4.5,
      projection,
      context,
      projectStream,
      contextStream;

  function path(object) {
    if (object) d4.geo.stream(object, projectStream(
        contextStream.pointRadius(typeof pointRadius === "function"
            ? +pointRadius.apply(this, arguments)
            : pointRadius)));
    return contextStream.result();
  }

  path.area = function(object) {
    d4_geo_pathAreaSum = 0;
    d4.geo.stream(object, projectStream(d4_geo_pathArea));
    return d4_geo_pathAreaSum;
  };

  path.centroid = function(object) {
    d4_geo_centroidDimension = d4_geo_centroidX = d4_geo_centroidY = d4_geo_centroidZ = 0;
    d4.geo.stream(object, projectStream(d4_geo_pathCentroid));
    return d4_geo_centroidZ ? [d4_geo_centroidX / d4_geo_centroidZ, d4_geo_centroidY / d4_geo_centroidZ] : undefined;
  };

  path.bounds = function(object) {
    d4_geo_pathBoundsX1 = d4_geo_pathBoundsY1 = -(d4_geo_pathBoundsX0 = d4_geo_pathBoundsY0 = Infinity);
    d4.geo.stream(object, projectStream(d4_geo_pathBounds));
    return [[d4_geo_pathBoundsX0, d4_geo_pathBoundsY0], [d4_geo_pathBoundsX1, d4_geo_pathBoundsY1]];
  };

  path.projection = function(_) {
    if (!arguments.length) return projection;
    projectStream = (projection = _) ? _.stream || d4_geo_pathProjectStream(_) : d4_identity;
    return path;
  };

  path.context = function(_) {
    if (!arguments.length) return context;
    contextStream = (context = _) == null ? new d4_geo_pathBuffer : new d4_geo_pathContext(_);
    return path;
  };

  path.pointRadius = function(_) {
    if (!arguments.length) return pointRadius;
    pointRadius = typeof _ === "function" ? _ : +_;
    return path;
  };

  return path.projection(d4.geo.albersUsa()).context(null);
};

function d4_geo_pathProjectStream(project) {
  var resample = d4_geo_resample(function(λ, φ) { return project([λ * d4_degrees, φ * d4_degrees]); });
  return function(stream) {
    stream = resample(stream);
    return {
      point: function(λ, φ) { stream.point(λ * d4_radians, φ * d4_radians); },
      sphere: function() { stream.sphere(); },
      lineStart: function() { stream.lineStart(); },
      lineEnd: function() { stream.lineEnd(); },
      polygonStart: function() { stream.polygonStart(); },
      polygonEnd: function() { stream.polygonEnd(); }
    };
  };
}
