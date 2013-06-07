var d4 = require("../../");

var formatNumber = d4.format(",.02r"),
    o = d4.geo.circle().angle(30).precision(.1)(),
    n = 1e3,
    then = Date.now();

for (var i = 0; i < n; i++) {
  d4.geo.area(o);
}

console.log("circle.angle(30°): " + formatNumber((Date.now() - then) / i) + "ms/op.");
