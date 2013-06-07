import "../arrays/bisect";
import "../core/rebind";
import "../core/true";
import "../scale/linear";
import "../scale/nice";
import "day";
import "format";
import "hour";
import "minute";
import "month";
import "second";
import "time";
import "week";
import "year";

function d4_time_scale(linear, methods, format) {

  function scale(x) {
    return linear(x);
  }

  scale.invert = function(x) {
    return d4_time_scaleDate(linear.invert(x));
  };

  scale.domain = function(x) {
    if (!arguments.length) return linear.domain().map(d4_time_scaleDate);
    linear.domain(x);
    return scale;
  };

  scale.nice = function(m) {
    return scale.domain(d4_scale_nice(scale.domain(), function() { return m; }));
  };

  scale.ticks = function(m, k) {
    var extent = d4_scaleExtent(scale.domain());
    if (typeof m !== "function") {
      var span = extent[1] - extent[0],
          target = span / m,
          i = d4.bisect(d4_time_scaleSteps, target);
      if (i == d4_time_scaleSteps.length) return methods.year(extent, m);
      if (!i) return linear.ticks(m).map(d4_time_scaleDate);
      if (Math.log(target / d4_time_scaleSteps[i - 1]) < Math.log(d4_time_scaleSteps[i] / target)) --i;
      m = methods[i];
      k = m[1];
      m = m[0].range;
    }
    return m(extent[0], new Date(+extent[1] + 1), k); // inclusive upper bound
  };

  scale.tickFormat = function() {
    return format;
  };

  scale.copy = function() {
    return d4_time_scale(linear.copy(), methods, format);
  };

  return d4_scale_linearRebind(scale, linear);
}

function d4_time_scaleDate(t) {
  return new Date(t);
}

function d4_time_scaleFormat(formats) {
  return function(date) {
    var i = formats.length - 1, f = formats[i];
    while (!f[1](date)) f = formats[--i];
    return f[0](date);
  };
}

function d4_time_scaleSetYear(y) {
  var d = new Date(y, 0, 1);
  d.setFullYear(y); // Y2K fail
  return d;
}

function d4_time_scaleGetYear(d) {
  var y = d.getFullYear(),
      d0 = d4_time_scaleSetYear(y),
      d1 = d4_time_scaleSetYear(y + 1);
  return y + (d - d0) / (d1 - d0);
}

var d4_time_scaleSteps = [
  1e3,    // 1-second
  5e3,    // 5-second
  15e3,   // 15-second
  3e4,    // 30-second
  6e4,    // 1-minute
  3e5,    // 5-minute
  9e5,    // 15-minute
  18e5,   // 30-minute
  36e5,   // 1-hour
  108e5,  // 3-hour
  216e5,  // 6-hour
  432e5,  // 12-hour
  864e5,  // 1-day
  1728e5, // 2-day
  6048e5, // 1-week
  2592e6, // 1-month
  7776e6, // 3-month
  31536e6 // 1-year
];

var d4_time_scaleLocalMethods = [
  [d4.time.second, 1],
  [d4.time.second, 5],
  [d4.time.second, 15],
  [d4.time.second, 30],
  [d4.time.minute, 1],
  [d4.time.minute, 5],
  [d4.time.minute, 15],
  [d4.time.minute, 30],
  [d4.time.hour, 1],
  [d4.time.hour, 3],
  [d4.time.hour, 6],
  [d4.time.hour, 12],
  [d4.time.day, 1],
  [d4.time.day, 2],
  [d4.time.week, 1],
  [d4.time.month, 1],
  [d4.time.month, 3],
  [d4.time.year, 1]
];

var d4_time_scaleLocalFormats = [
  [d4.time.format("%Y"), d4_true],
  [d4.time.format("%B"), function(d) { return d.getMonth(); }],
  [d4.time.format("%b %d"), function(d) { return d.getDate() != 1; }],
  [d4.time.format("%a %d"), function(d) { return d.getDay() && d.getDate() != 1; }],
  [d4.time.format("%I %p"), function(d) { return d.getHours(); }],
  [d4.time.format("%I:%M"), function(d) { return d.getMinutes(); }],
  [d4.time.format(":%S"), function(d) { return d.getSeconds(); }],
  [d4.time.format(".%L"), function(d) { return d.getMilliseconds(); }]
];

var d4_time_scaleLinear = d4.scale.linear(),
    d4_time_scaleLocalFormat = d4_time_scaleFormat(d4_time_scaleLocalFormats);

d4_time_scaleLocalMethods.year = function(extent, m) {
  return d4_time_scaleLinear.domain(extent.map(d4_time_scaleGetYear)).ticks(m).map(d4_time_scaleSetYear);
};

d4.time.scale = function() {
  return d4_time_scale(d4.scale.linear(), d4_time_scaleLocalMethods, d4_time_scaleLocalFormat);
};
