d4.interpolateRound = d4_interpolateRound;

function d4_interpolateRound(a, b) {
  b -= a;
  return function(t) { return Math.round(a + b * t); };
}
