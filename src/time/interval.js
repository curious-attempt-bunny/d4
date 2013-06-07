import "time";

function d4_time_interval(local, step, number) {

  function round(date) {
    var d0 = local(date), d1 = offset(d0, 1);
    return date - d0 < d1 - date ? d0 : d1;
  }

  function ceil(date) {
    step(date = local(new d4_time(date - 1)), 1);
    return date;
  }

  function offset(date, k) {
    step(date = new d4_time(+date), k);
    return date;
  }

  function range(t0, t1, dt) {
    var time = ceil(t0), times = [];
    if (dt > 1) {
      while (time < t1) {
        if (!(number(time) % dt)) times.push(new Date(+time));
        step(time, 1);
      }
    } else {
      while (time < t1) times.push(new Date(+time)), step(time, 1);
    }
    return times;
  }

  function range_utc(t0, t1, dt) {
    try {
      d4_time = d4_time_utc;
      var utc = new d4_time_utc();
      utc._ = t0;
      return range(utc, t1, dt);
    } finally {
      d4_time = Date;
    }
  }

  local.floor = local;
  local.round = round;
  local.ceil = ceil;
  local.offset = offset;
  local.range = range;

  var utc = local.utc = d4_time_interval_utc(local);
  utc.floor = utc;
  utc.round = d4_time_interval_utc(round);
  utc.ceil = d4_time_interval_utc(ceil);
  utc.offset = d4_time_interval_utc(offset);
  utc.range = range_utc;

  return local;
}

function d4_time_interval_utc(method) {
  return function(date, k) {
    try {
      d4_time = d4_time_utc;
      var utc = new d4_time_utc();
      utc._ = date;
      return method(utc, k)._;
    } finally {
      d4_time = Date;
    }
  };
}
