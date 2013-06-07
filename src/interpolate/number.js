d4.interpolateNumber = d4_interpolateNumber;

function d4_interpolateNumber(a, b) {
  b -= a = +a;
  return function(t) { return a + b * t; };
}
