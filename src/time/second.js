import "interval";
import "time";

d4.time.second = d4_time_interval(function(date) {
  return new d4_time(Math.floor(date / 1e3) * 1e3);
}, function(date, offset) {
  date.setTime(date.getTime() + Math.floor(offset) * 1e3); // DST breaks setSeconds
}, function(date) {
  return date.getSeconds();
});

d4.time.seconds = d4.time.second.range;
d4.time.seconds.utc = d4.time.second.utc.range;
