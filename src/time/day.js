import "interval";
import "time";
import "year";

d4.time.day = d4_time_interval(function(date) {
  var day = new d4_time(1970, 0);
  day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  return day;
}, function(date, offset) {
  date.setDate(date.getDate() + offset);
}, function(date) {
  return date.getDate() - 1;
});

d4.time.days = d4.time.day.range;
d4.time.days.utc = d4.time.day.utc.range;

d4.time.dayOfYear = function(date) {
  var year = d4.time.year(date);
  return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);
};
