import "geo";
import "projection";

function d4_geo_equirectangular(λ, φ) {
  return [λ, φ];
}

(d4.geo.equirectangular = function() {
  return d4_geo_projection(d4_geo_equirectangular);
}).raw = d4_geo_equirectangular.invert = d4_geo_equirectangular;
