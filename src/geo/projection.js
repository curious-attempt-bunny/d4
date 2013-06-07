import "../core/identity";
import "../core/rebind";
import "../math/trigonometry";
import "clip-antimeridian";
import "clip-circle";
import "clip-view";
import "compose";
import "geo";
import "resample";
import "rotation";
import "stream";

d4.geo.projection = d4_geo_projection;
d4.geo.projectionMutator = d4_geo_projectionMutator;

function d4_geo_projection(project) {
  return d4_geo_projectionMutator(function() { return project; })();
}

function d4_geo_projectionMutator(projectAt) {
  var project,
      rotate,
      projectRotate,
      projectResample = d4_geo_resample(function(x, y) { x = project(x, y); return [x[0] * k + δx, δy - x[1] * k]; }),
      k = 150, // scale
      x = 480, y = 250, // translate
      λ = 0, φ = 0, // center
      δλ = 0, δφ = 0, δγ = 0, // rotate
      δx, δy, // center
      preclip = d4_geo_clipAntimeridian,
      postclip = d4_identity,
      clipAngle = null,
      clipExtent = null;

  function projection(point) {
    point = projectRotate(point[0] * d4_radians, point[1] * d4_radians);
    return [point[0] * k + δx, δy - point[1] * k];
  }

  function invert(point) {
    point = projectRotate.invert((point[0] - δx) / k, (δy - point[1]) / k);
    return point && [point[0] * d4_degrees, point[1] * d4_degrees];
  }

  projection.stream = function(stream) {
    return d4_geo_projectionRadiansRotate(rotate, preclip(projectResample(postclip(stream))));
  };

  projection.clipAngle = function(_) {
    if (!arguments.length) return clipAngle;
    preclip = _ == null ? (clipAngle = _, d4_geo_clipAntimeridian) : d4_geo_clipCircle((clipAngle = +_) * d4_radians);
    return projection;
  };

  projection.clipExtent = function(_) {
    if (!arguments.length) return clipExtent;
    clipExtent = _;
    postclip = _ == null ? d4_identity : d4_geo_clipView(_[0][0], _[0][1], _[1][0], _[1][1]);
    return projection;
  };

  projection.scale = function(_) {
    if (!arguments.length) return k;
    k = +_;
    return reset();
  };

  projection.translate = function(_) {
    if (!arguments.length) return [x, y];
    x = +_[0];
    y = +_[1];
    return reset();
  };

  projection.center = function(_) {
    if (!arguments.length) return [λ * d4_degrees, φ * d4_degrees];
    λ = _[0] % 360 * d4_radians;
    φ = _[1] % 360 * d4_radians;
    return reset();
  };

  projection.rotate = function(_) {
    if (!arguments.length) return [δλ * d4_degrees, δφ * d4_degrees, δγ * d4_degrees];
    δλ = _[0] % 360 * d4_radians;
    δφ = _[1] % 360 * d4_radians;
    δγ = _.length > 2 ? _[2] % 360 * d4_radians : 0;
    return reset();
  };

  d4.rebind(projection, projectResample, "precision");

  function reset() {
    projectRotate = d4_geo_compose(rotate = d4_geo_rotation(δλ, δφ, δγ), project);
    var center = project(λ, φ);
    δx = x - center[0] * k;
    δy = y + center[1] * k;
    return projection;
  }

  return function() {
    project = projectAt.apply(this, arguments);
    projection.invert = project.invert && invert;
    return reset();
  };
}

function d4_geo_projectionRadiansRotate(rotate, stream) {
  return {
    point: function(x, y) {
      y = rotate(x * d4_radians, y * d4_radians), x = y[0];
      stream.point(x > π ? x - 2 * π : x < -π ? x + 2 * π : x, y[1]);
    },
    sphere: function() { stream.sphere(); },
    lineStart: function() { stream.lineStart(); },
    lineEnd: function() { stream.lineEnd(); },
    polygonStart: function() { stream.polygonStart(); },
    polygonEnd: function() { stream.polygonEnd(); }
  };
}
