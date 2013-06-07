import "dispatch";

d4.event = null;

function d4_eventCancel() {
  d4.event.stopPropagation();
  d4.event.preventDefault();
}

function d4_eventSource() {
  var e = d4.event, s;
  while (s = e.sourceEvent) e = s;
  return e;
}

// Registers an event listener for the specified target that cancels the next
// event for the specified type, but only if it occurs immediately. This is
// useful to disambiguate dragging from clicking.
function d4_eventSuppress(target, type) {
  function off() { target.on(type, null); }
  target.on(type, function() { d4_eventCancel(); off(); }, true);
  setTimeout(off, 0); // clear the handler if it doesn't fire
}

// Like d4.dispatch, but for custom events abstracting native UI events. These
// events have a target component (such as a brush), a target element (such as
// the svg:g element containing the brush) and the standard arguments `d` (the
// target element's data) and `i` (the selection index of the target element).
function d4_eventDispatch(target) {
  var dispatch = new d4_dispatch,
      i = 0,
      n = arguments.length;

  while (++i < n) dispatch[arguments[i]] = d4_dispatch_event(dispatch);

  // Creates a dispatch context for the specified `thiz` (typically, the target
  // DOM element that received the source event) and `argumentz` (typically, the
  // data `d` and index `i` of the target element). The returned function can be
  // used to dispatch an event to any registered listeners; the function takes a
  // single argument as input, being the event to dispatch. The event must have
  // a "type" attribute which corresponds to a type registered in the
  // constructor. This context will automatically populate the "sourceEvent" and
  // "target" attributes of the event, as well as setting the `d4.event` global
  // for the duration of the notification.
  dispatch.of = function(thiz, argumentz) {
    return function(e1) {
      try {
        var e0 =
        e1.sourceEvent = d4.event;
        e1.target = target;
        d4.event = e1;
        dispatch[e1.type].apply(thiz, argumentz);
      } finally {
        d4.event = e0;
      }
    };
  };

  return dispatch;
}
