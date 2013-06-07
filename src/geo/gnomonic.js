import "azimuthal";
import "geo";
import "projection";

var d4_geo_gnomonic = d4_geo_azimuthal(
  function(cosλcosφ) { return 1 / cosλcosφ; },
  Math.atan
);

(d4.geo.gnomonic = function() {
  return d4_geo_projection(d4_geo_gnomonic);
}).raw = d4_geo_gnomonic;
