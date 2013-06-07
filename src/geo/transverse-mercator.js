import "../math/trigonometry";
import "geo";
import "mercator";
import "projection";

function d4_geo_transverseMercator(λ, φ) {
  var B = Math.cos(φ) * Math.sin(λ);
  return [
    Math.log((1 + B) / (1 - B)) / 2,
    Math.atan2(Math.tan(φ), Math.cos(λ))
  ];
}

d4_geo_transverseMercator.invert = function(x, y) {
  return [
    Math.atan2(d4_sinh(x), Math.cos(y)),
    d4_asin(Math.sin(y) / d4_cosh(x))
  ];
};

(d4.geo.transverseMercator = function() {
  return d4_geo_mercatorProjection(d4_geo_transverseMercator);
}).raw = d4_geo_transverseMercator;
