import "day";
import "interval";
import "time";

d4.time.month = d4_time_interval(function(date) {
  date = d4.time.day(date);
  date.setDate(1);
  return date;
}, function(date, offset) {
  date.setMonth(date.getMonth() + offset);
}, function(date) {
  return date.getMonth();
});

d4.time.months = d4.time.month.range;
d4.time.months.utc = d4.time.month.utc.range;
