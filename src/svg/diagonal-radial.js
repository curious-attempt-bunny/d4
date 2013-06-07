import "arc";
import "diagonal";
import "svg";

d4.svg.diagonal.radial = function() {
  var diagonal = d4.svg.diagonal(),
      projection = d4_svg_diagonalProjection,
      projection_ = diagonal.projection;

  diagonal.projection = function(x) {
    return arguments.length
        ? projection_(d4_svg_diagonalRadialProjection(projection = x))
        : projection;
  };

  return diagonal;
};

function d4_svg_diagonalRadialProjection(projection) {
  return function() {
    var d = projection.apply(this, arguments),
        r = d[0],
        a = d[1] + d4_svg_arcOffset;
    return [r * Math.cos(a), r * Math.sin(a)];
  };
}
