d4.time = {};

var d4_time = Date,
    d4_time_daySymbols = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function d4_time_utc() {
  this._ = new Date(arguments.length > 1
      ? Date.UTC.apply(this, arguments)
      : arguments[0]);
}

d4_time_utc.prototype = {
  getDate: function() { return this._.getUTCDate(); },
  getDay: function() { return this._.getUTCDay(); },
  getFullYear: function() { return this._.getUTCFullYear(); },
  getHours: function() { return this._.getUTCHours(); },
  getMilliseconds: function() { return this._.getUTCMilliseconds(); },
  getMinutes: function() { return this._.getUTCMinutes(); },
  getMonth: function() { return this._.getUTCMonth(); },
  getSeconds: function() { return this._.getUTCSeconds(); },
  getTime: function() { return this._.getTime(); },
  getTimezoneOffset: function() { return 0; },
  valueOf: function() { return this._.valueOf(); },
  setDate: function() { d4_time_prototype.setUTCDate.apply(this._, arguments); },
  setDay: function() { d4_time_prototype.setUTCDay.apply(this._, arguments); },
  setFullYear: function() { d4_time_prototype.setUTCFullYear.apply(this._, arguments); },
  setHours: function() { d4_time_prototype.setUTCHours.apply(this._, arguments); },
  setMilliseconds: function() { d4_time_prototype.setUTCMilliseconds.apply(this._, arguments); },
  setMinutes: function() { d4_time_prototype.setUTCMinutes.apply(this._, arguments); },
  setMonth: function() { d4_time_prototype.setUTCMonth.apply(this._, arguments); },
  setSeconds: function() { d4_time_prototype.setUTCSeconds.apply(this._, arguments); },
  setTime: function() { d4_time_prototype.setTime.apply(this._, arguments); }
};

var d4_time_prototype = Date.prototype;
