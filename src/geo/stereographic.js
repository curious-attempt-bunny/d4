import "azimuthal";
import "geo";
import "projection";

var d4_geo_stereographic = d4_geo_azimuthal(
  function(cosλcosφ) { return 1 / (1 + cosλcosφ); },
  function(ρ) { return 2 * Math.atan(ρ); }
);

(d4.geo.stereographic = function() {
  return d4_geo_projection(d4_geo_stereographic);
}).raw = d4_geo_stereographic;
