var π = Math.PI,
    ε = 1e-6,
    d4_radians = π / 180,
    d4_degrees = 180 / π;

function d4_sgn(x) {
  return x > 0 ? 1 : x < 0 ? -1 : 0;
}

function d4_acos(x) {
  return Math.acos(Math.max(-1, Math.min(1, x)));
}

function d4_asin(x) {
  return x > 1 ? π / 2 : x < -1 ? -π / 2 : Math.asin(x);
}

function d4_sinh(x) {
  return (Math.exp(x) - Math.exp(-x)) / 2;
}

function d4_cosh(x) {
  return (Math.exp(x) + Math.exp(-x)) / 2;
}

function d4_haversin(x) {
  return (x = Math.sin(x / 2)) * x;
}
