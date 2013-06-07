import "min";

d4.zip = function() {
  if (!(n = arguments.length)) return [];
  for (var i = -1, m = d4.min(arguments, d4_zipLength), zips = new Array(m); ++i < m;) {
    for (var j = -1, n, zip = zips[i] = new Array(n); ++j < n;) {
      zip[j] = arguments[j][i];
    }
  }
  return zips;
};

function d4_zipLength(d) {
  return d.length;
}
