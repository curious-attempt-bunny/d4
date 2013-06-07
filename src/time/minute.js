import "interval";
import "time";

d4.time.minute = d4_time_interval(function(date) {
  return new d4_time(Math.floor(date / 6e4) * 6e4);
}, function(date, offset) {
  date.setTime(date.getTime() + Math.floor(offset) * 6e4); // DST breaks setMinutes
}, function(date) {
  return date.getMinutes();
});

d4.time.minutes = d4.time.minute.range;
d4.time.minutes.utc = d4.time.minute.utc.range;
