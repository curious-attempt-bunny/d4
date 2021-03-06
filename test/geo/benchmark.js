var fs = require("fs"),
    d4 = require("../../");

var formatNumber = d4.format(",.02r"),
    projection = d4.geo.stereographic().clipAngle(150),
    path = d4.geo.path().projection(projection),
    graticule = d4.geo.graticule().step([1, 1]),
    circle = d4.geo.circle().angle(30),
    n = 10,
    o,
    then;

o = JSON.parse(fs.readFileSync("./test/data/us-counties.json"));
then = Date.now();

for (var i = 0, k = 0; i < n; i++, k++) {
  path(o);
}

console.log("U.S. counties: " + formatNumber((Date.now() - then) / k) + "ms/op.");

o = graticule();
then = Date.now();

for (var i = 0, k = 0; i < n; i++, k++) {
  path(o);
}

console.log("Dense graticule: " + formatNumber((Date.now() - then) / k) + "ms/op.");

o = {type: "GeometryCollection", geometries: d4.range(-180, 180, 1).map(function(x) {
  return circle.origin([x, 0])();
})};
then = Date.now();

for (var i = 0, k = 0; i < n; i++, k++) {
  path(o);
}

console.log("Circle polygons: " + formatNumber((Date.now() - then) / k) + "ms/op.");

o = spiral();
then = Date.now();

for (var i = 0, k = 0; i < n; i++, k++) {
  path(o);
}

console.log("Spiral polygons: " + formatNumber((Date.now() - then) / k) + "ms/op.");

function spiral() {
  var n = 1e4,
      dy = 5;

  var spiral = d4.range(0, 1 + 1 / n, 1 / n).map(function(t) {
      return [(360 * 10 * t) % 360 - 180, -90 + dy + (90 - dy) * 2 * t];
  }).concat(d4.range(1, 0, -1 / n).map(function(t) {
      return [(360 * 10 * t) % 360 - 180, -90 + (90 - dy) * 2 * t];
  }));
  spiral.push(spiral[0]);

  return {type: "Polygon", coordinates: [spiral]};
}
