import "../core/identity";
import "azimuthal";
import "geo";
import "projection";

var d4_geo_azimuthalEquidistant = d4_geo_azimuthal(
  function(cosλcosφ) { var c = Math.acos(cosλcosφ); return c && c / Math.sin(c); },
  d4_identity
);

(d4.geo.azimuthalEquidistant = function() {
  return d4_geo_projection(d4_geo_azimuthalEquidistant);
}).raw = d4_geo_azimuthalEquidistant;
