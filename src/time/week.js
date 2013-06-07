import "day";
import "interval";
import "time";
import "year";

d4_time_daySymbols.forEach(function(day, i) {
  day = day.toLowerCase();
  i = 7 - i;

  var interval = d4.time[day] = d4_time_interval(function(date) {
    (date = d4.time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7);
    return date;
  }, function(date, offset) {
    date.setDate(date.getDate() + Math.floor(offset) * 7);
  }, function(date) {
    var day = d4.time.year(date).getDay();
    return Math.floor((d4.time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i);
  });

  d4.time[day + "s"] = interval.range;
  d4.time[day + "s"].utc = interval.utc.range;

  d4.time[day + "OfYear"] = function(date) {
    var day = d4.time.year(date).getDay();
    return Math.floor((d4.time.dayOfYear(date) + (day + i) % 7) / 7);
  };
});

d4.time.week = d4.time.sunday;
d4.time.weeks = d4.time.sunday.range;
d4.time.weeks.utc = d4.time.sunday.utc.range;
d4.time.weekOfYear = d4.time.sundayOfYear;
