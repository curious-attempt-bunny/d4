import "interval";
import "time";

d4.time.hour = d4_time_interval(function(date) {
  var timezone = date.getTimezoneOffset() / 60;
  return new d4_time((Math.floor(date / 36e5 - timezone) + timezone) * 36e5);
}, function(date, offset) {
  date.setTime(date.getTime() + Math.floor(offset) * 36e5); // DST breaks setHours
}, function(date) {
  return date.getHours();
});

d4.time.hours = d4.time.hour.range;
d4.time.hours.utc = d4.time.hour.utc.range;
