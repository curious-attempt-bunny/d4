import "../math/trigonometry";

function d3_geo_spherical(cartesian) {
  return [
    Math.atan2(cartesian[1], cartesian[0]),
    d3_asin(cartesian[2])
  ];
}

function d3_geo_sphericalEqual(a, b, t) {
  if (arguments.length < 3) t = ε;
  return Math.abs(a[1] - b[1]) < t && (Math.abs(Math.abs(a[1]) - π / 2) < t ||
       d3_geo_sphericalLongitudeDifference(a[0], b[0]) < t);
}

function d3_geo_sphericalLongitudeDifference(λ0, λ1) {
  var dλ = Math.abs(λ1 - λ0);
  return dλ > π ? 2 * π - dλ : dλ;
}
