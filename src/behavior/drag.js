import "../core/document";
import "../core/rebind";
import "../event/event";
import "../event/mouse";
import "../event/touches";
import "behavior";

d4.behavior.drag = function() {
  var event = d4_eventDispatch(drag, "drag", "dragstart", "dragend"),
      origin = null;

  function drag() {
    this.on("mousedown.drag", mousedown)
        .on("touchstart.drag", mousedown);
  }

  function mousedown() {
    var target = this,
        event_ = event.of(target, arguments),
        eventTarget = d4.event.target,
        touchId = d4.event.touches ? d4.event.changedTouches[0].identifier : null,
        offset,
        origin_ = point(),
        moved = 0;

    var w = d4.select(d4_window)
        .on(touchId != null ? "touchmove.drag-" + touchId : "mousemove.drag", dragmove)
        .on(touchId != null ? "touchend.drag-" + touchId : "mouseup.drag", dragend, true);

    if (origin) {
      offset = origin.apply(target, arguments);
      offset = [offset.x - origin_[0], offset.y - origin_[1]];
    } else {
      offset = [0, 0];
    }

    // Only cancel mousedown; touchstart is needed for draggable links.
    if (touchId == null) d4_eventCancel();
    event_({type: "dragstart"});

    function point() {
      var p = target.parentNode;
      return touchId != null
          ? d4.touches(p).filter(function(p) { return p.identifier === touchId; })[0]
          : d4.mouse(p);
    }

    function dragmove() {
      if (!target.parentNode) return dragend(); // target removed from DOM

      var p = point(),
          dx = p[0] - origin_[0],
          dy = p[1] - origin_[1];

      moved |= dx | dy;
      origin_ = p;
      d4_eventCancel();

      event_({type: "drag", x: p[0] + offset[0], y: p[1] + offset[1], dx: dx, dy: dy});
    }

    function dragend() {
      event_({type: "dragend"});

      // if moved, prevent the mouseup (and possibly click) from propagating
      if (moved) {
        d4_eventCancel();
        if (d4.event.target === eventTarget) d4_eventSuppress(w, "click");
      }

      w .on(touchId != null ? "touchmove.drag-" + touchId : "mousemove.drag", null)
        .on(touchId != null ? "touchend.drag-" + touchId : "mouseup.drag", null);
    }
  }

  drag.origin = function(x) {
    if (!arguments.length) return origin;
    origin = x;
    return drag;
  };

  return d4.rebind(drag, event, "on");
};
