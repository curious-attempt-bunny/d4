import "../core/array";
import "event";
import "mouse";

d4.touches = function(container, touches) {
  if (arguments.length < 2) touches = d4_eventSource().touches;
  return touches ? d4_array(touches).map(function(touch) {
    var point = d4_mousePoint(container, touch);
    point.identifier = touch.identifier;
    return point;
  }) : [];
};
