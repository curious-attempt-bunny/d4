import "format";
import "time";

d4.time.format.utc = function(template) {
  var local = d4.time.format(template);

  function format(date) {
    try {
      d4_time = d4_time_utc;
      var utc = new d4_time();
      utc._ = date;
      return local(utc);
    } finally {
      d4_time = Date;
    }
  }

  format.parse = function(string) {
    try {
      d4_time = d4_time_utc;
      var date = local.parse(string);
      return date && date._;
    } finally {
      d4_time = Date;
    }
  };

  format.toString = local.toString;

  return format;
};
