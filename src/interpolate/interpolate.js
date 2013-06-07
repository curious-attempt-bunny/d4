import "../color/color";
import "../color/rgb";
import "rgb";
import "transform";
import "object";
import "array";
import "number";
import "string";

d4.interpolate = d4_interpolate;

function d4_interpolate(a, b) {
  var i = d4.interpolators.length, f;
  while (--i >= 0 && !(f = d4.interpolators[i](a, b)));
  return f;
}

function d4_interpolateByName(name) {
  return name == "transform"
      ? d4_interpolateTransform
      : d4_interpolate;
}

d4.interpolators = [
  function(a, b) {
    var t = typeof b;
    return (t === "string" ? (d4_rgb_names.has(b) || /^(#|rgb\(|hsl\()/.test(b) ? d4_interpolateRgb : d4_interpolateString)
        : b instanceof d4_Color ? d4_interpolateRgb
        : t === "object" ? (Array.isArray(b) ? d4_interpolateArray : d4_interpolateObject)
        : d4_interpolateNumber)(a, b);
  }
];
