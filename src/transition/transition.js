import "../arrays/map";
import "../core/array";
import "../event/dispatch";
import "../event/timer";
import "../interpolate/ease";
import "../selection/selection";

function d4_transition(groups, id) {
  d4_arraySubclass(groups, d4_transitionPrototype);

  groups.id = id; // Note: read-only!

  return groups;
}

var d4_transitionPrototype = [],
    d4_transitionId = 0,
    d4_transitionInheritId,
    d4_transitionInherit = {ease: d4_ease_cubicInOut, delay: 0, duration: 250};

d4_transitionPrototype.call = d4_selectionPrototype.call;
d4_transitionPrototype.empty = d4_selectionPrototype.empty;
d4_transitionPrototype.node = d4_selectionPrototype.node;

d4.transition = function(selection) {
  return arguments.length
      ? (d4_transitionInheritId ? selection.transition() : selection)
      : d4_selectionRoot.transition();
};

d4.transition.prototype = d4_transitionPrototype;

import "select";
import "selectAll";
import "filter";
import "attr";
import "style";
import "text";
import "remove";
import "ease";
import "delay";
import "duration";
import "each";
import "subtransition";
import "tween";

function d4_transitionNode(node, i, id, inherit) {
  var lock = node.__transition__ || (node.__transition__ = {active: 0, count: 0}),
      transition = lock[id];

  if (!transition) {
    var time = inherit.time;

    transition = lock[id] = {
      tween: new d4_Map,
      event: d4.dispatch("start", "end"), // TODO construct lazily?
      time: time,
      ease: inherit.ease,
      delay: inherit.delay,
      duration: inherit.duration
    };

    ++lock.count;

    d4.timer(function(elapsed) {
      var d = node.__data__,
          ease = transition.ease,
          event = transition.event,
          delay = transition.delay,
          duration = transition.duration,
          tweened = [];

      return delay <= elapsed
          ? start(elapsed)
          : d4.timer(start, delay, time), 1;

      function start(elapsed) {
        if (lock.active > id) return stop();
        lock.active = id;
        event.start.call(node, d, i);

        transition.tween.forEach(function(key, value) {
          if (value = value.call(node, d, i)) {
            tweened.push(value);
          }
        });

        if (!tick(elapsed)) d4.timer(tick, 0, time);
        return 1;
      }

      function tick(elapsed) {
        if (lock.active !== id) return stop();

        var t = (elapsed - delay) / duration,
            e = ease(t),
            n = tweened.length;

        while (n > 0) {
          tweened[--n].call(node, e);
        }

        if (t >= 1) {
          stop();
          event.end.call(node, d, i);
          return 1;
        }
      }

      function stop() {
        if (--lock.count) delete lock[id];
        else delete node.__transition__;
        return 1;
      }
    }, 0, time);

    return transition;
  }
}
