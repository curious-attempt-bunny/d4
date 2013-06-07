d4.scale = {};

function d4_scaleExtent(domain) {
  var start = domain[0], stop = domain[domain.length - 1];
  return start < stop ? [start, stop] : [stop, start];
}

function d4_scaleRange(scale) {
  return scale.rangeExtent ? scale.rangeExtent() : d4_scaleExtent(scale.range());
}
