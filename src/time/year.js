import "day";
import "interval";
import "time";

d4.time.year = d4_time_interval(function(date) {
  date = d4.time.day(date);
  date.setMonth(0, 1);
  return date;
}, function(date, offset) {
  date.setFullYear(date.getFullYear() + offset);
}, function(date) {
  return date.getFullYear();
});

d4.time.years = d4.time.year.range;
d4.time.years.utc = d4.time.year.utc.range;
