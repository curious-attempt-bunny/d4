import "../core/document";

var d4_timer_queueHead,
    d4_timer_queueTail,
    d4_timer_interval, // is an interval (or frame) active?
    d4_timer_timeout; // is a timeout active?

// The timer will continue to fire until callback returns true.
d4.timer = function(callback, delay, then) {
  if (arguments.length < 3) {
    if (arguments.length < 2) delay = 0;
    else if (!isFinite(delay)) return;
    then = Date.now();
  }

  var time = then + delay;

  // Add the callback to the tail of the queue.
  var timer = {callback: callback, time: time, next: null};
  if (d4_timer_queueTail) d4_timer_queueTail.next = timer;
  else d4_timer_queueHead = timer;
  d4_timer_queueTail = timer;

  // Start animatin'!
  if (!d4_timer_interval) {
    d4_timer_timeout = clearTimeout(d4_timer_timeout);
    d4_timer_interval = 1;
    d4_timer_frame(d4_timer_step);
  }
};

function d4_timer_step() {
  var now = d4_timer_mark(),
      delay = d4_timer_sweep() - now;
  if (delay > 24) {
    if (isFinite(delay)) {
      clearTimeout(d4_timer_timeout);
      d4_timer_timeout = setTimeout(d4_timer_step, delay);
    }
    d4_timer_interval = 0;
  } else {
    d4_timer_interval = 1;
    d4_timer_frame(d4_timer_step);
  }
}

d4.timer.flush = function() {
  d4_timer_mark();
  d4_timer_sweep();
};

function d4_timer_mark() {
  var now = Date.now(),
      timer = d4_timer_queueHead;
  while (timer) {
    if (now >= timer.time) timer.flush = timer.callback(now - timer.time);
    timer = timer.next;
  }
  return now;
}

// Flush after callbacks to avoid concurrent queue modification.
// Returns the time of the earliest active timer, post-sweep.
function d4_timer_sweep() {
  var t0,
      t1 = d4_timer_queueHead,
      time = Infinity;
  while (t1) {
    if (t1.flush) {
      t1 = t0 ? t0.next = t1.next : d4_timer_queueHead = t1.next;
    } else {
      if (t1.time < time) time = t1.time;
      t1 = (t0 = t1).next;
    }
  }
  d4_timer_queueTail = t0;
  return time;
}

var d4_timer_frame = d4_window.requestAnimationFrame
    || d4_window.webkitRequestAnimationFrame
    || d4_window.mozRequestAnimationFrame
    || d4_window.oRequestAnimationFrame
    || d4_window.msRequestAnimationFrame
    || function(callback) { setTimeout(callback, 17); };
