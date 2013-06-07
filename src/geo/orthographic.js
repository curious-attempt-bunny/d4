import "azimuthal";
import "geo";
import "projection";

var d4_geo_orthographic = d4_geo_azimuthal(
  function() { return 1; },
  Math.asin
);

(d4.geo.orthographic = function() {
  return d4_geo_projection(d4_geo_orthographic);
}).raw = d4_geo_orthographic;
