import "../core/true";
import "../scale/linear";
import "format";
import "format-utc";
import "scale";

var d4_time_scaleUTCMethods = d4_time_scaleLocalMethods.map(function(m) {
  return [m[0].utc, m[1]];
});

var d4_time_scaleUTCFormats = [
  [d4.time.format.utc("%Y"), d4_true],
  [d4.time.format.utc("%B"), function(d) { return d.getUTCMonth(); }],
  [d4.time.format.utc("%b %d"), function(d) { return d.getUTCDate() != 1; }],
  [d4.time.format.utc("%a %d"), function(d) { return d.getUTCDay() && d.getUTCDate() != 1; }],
  [d4.time.format.utc("%I %p"), function(d) { return d.getUTCHours(); }],
  [d4.time.format.utc("%I:%M"), function(d) { return d.getUTCMinutes(); }],
  [d4.time.format.utc(":%S"), function(d) { return d.getUTCSeconds(); }],
  [d4.time.format.utc(".%L"), function(d) { return d.getUTCMilliseconds(); }]
];

var d4_time_scaleUTCFormat = d4_time_scaleFormat(d4_time_scaleUTCFormats);

function d4_time_scaleUTCSetYear(y) {
  var d = new Date(Date.UTC(y, 0, 1));
  d.setUTCFullYear(y); // Y2K fail
  return d;
}

function d4_time_scaleUTCGetYear(d) {
  var y = d.getUTCFullYear(),
      d0 = d4_time_scaleUTCSetYear(y),
      d1 = d4_time_scaleUTCSetYear(y + 1);
  return y + (d - d0) / (d1 - d0);
}

d4_time_scaleUTCMethods.year = function(extent, m) {
  return d4_time_scaleLinear.domain(extent.map(d4_time_scaleUTCGetYear)).ticks(m).map(d4_time_scaleUTCSetYear);
};

d4.time.scale.utc = function() {
  return d4_time_scale(d4.scale.linear(), d4_time_scaleUTCMethods, d4_time_scaleUTCFormat);
};
