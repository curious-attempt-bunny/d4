import "azimuthal";
import "geo";
import "projection";

var d4_geo_azimuthalEqualArea = d4_geo_azimuthal(
  function(cosλcosφ) { return Math.sqrt(2 / (1 + cosλcosφ)); },
  function(ρ) { return 2 * Math.asin(ρ / 2); }
);

(d4.geo.azimuthalEqualArea = function() {
  return d4_geo_projection(d4_geo_azimuthalEqualArea);
}).raw = d4_geo_azimuthalEqualArea;
