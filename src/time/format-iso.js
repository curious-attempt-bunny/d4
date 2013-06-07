import "format";
import "format-utc";
import "time";

var d4_time_formatIso = d4.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");

d4.time.format.iso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z")
    ? d4_time_formatIsoNative
    : d4_time_formatIso;

function d4_time_formatIsoNative(date) {
  return date.toISOString();
}

d4_time_formatIsoNative.parse = function(string) {
  var date = new Date(string);
  return isNaN(date) ? null : date;
};

d4_time_formatIsoNative.toString = d4_time_formatIso.toString;
