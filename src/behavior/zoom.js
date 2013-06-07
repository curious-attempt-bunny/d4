import "../core/document";
import "../core/rebind";
import "../event/event";
import "../event/mouse";
import "../event/touches";
import "../selection/selection";
import "behavior";

d4.behavior.zoom = function() {
  var translate = [0, 0],
      translate0, // translate when we started zooming (to avoid drift)
      scale = 1,
      scale0, // scale when we started touching
      scaleExtent = d4_behavior_zoomInfinity,
      event = d4_eventDispatch(zoom, "zoom"),
      x0,
      x1,
      y0,
      y1,
      touchtime; // time of last touchstart (to detect double-tap)

  function zoom() {
    this.on("mousedown.zoom", mousedown)
        .on("mousemove.zoom", mousemove)
        .on(d4_behavior_zoomWheel + ".zoom", mousewheel)
        .on("dblclick.zoom", dblclick)
        .on("touchstart.zoom", touchstart)
        .on("touchmove.zoom", touchmove)
        .on("touchend.zoom", touchstart);
  }

  zoom.translate = function(x) {
    if (!arguments.length) return translate;
    translate = x.map(Number);
    rescale();
    return zoom;
  };

  zoom.scale = function(x) {
    if (!arguments.length) return scale;
    scale = +x;
    rescale();
    return zoom;
  };

  zoom.scaleExtent = function(x) {
    if (!arguments.length) return scaleExtent;
    scaleExtent = x == null ? d4_behavior_zoomInfinity : x.map(Number);
    return zoom;
  };

  zoom.x = function(z) {
    if (!arguments.length) return x1;
    x1 = z;
    x0 = z.copy();
    translate = [0, 0];
    scale = 1;
    return zoom;
  };

  zoom.y = function(z) {
    if (!arguments.length) return y1;
    y1 = z;
    y0 = z.copy();
    translate = [0, 0];
    scale = 1;
    return zoom;
  };

  function location(p) {
    return [(p[0] - translate[0]) / scale, (p[1] - translate[1]) / scale];
  }

  function point(l) {
    return [l[0] * scale + translate[0], l[1] * scale + translate[1]];
  }

  function scaleTo(s) {
    scale = Math.max(scaleExtent[0], Math.min(scaleExtent[1], s));
  }

  function translateTo(p, l) {
    l = point(l);
    translate[0] += p[0] - l[0];
    translate[1] += p[1] - l[1];
  }

  function rescale() {
    if (x1) x1.domain(x0.range().map(function(x) { return (x - translate[0]) / scale; }).map(x0.invert));
    if (y1) y1.domain(y0.range().map(function(y) { return (y - translate[1]) / scale; }).map(y0.invert));
  }

  function dispatch(event) {
    rescale();
    d4.event.preventDefault();
    event({type: "zoom", scale: scale, translate: translate});
  }

  function mousedown() {
    var target = this,
        event_ = event.of(target, arguments),
        eventTarget = d4.event.target,
        moved = 0,
        w = d4.select(d4_window).on("mousemove.zoom", mousemove).on("mouseup.zoom", mouseup),
        l = location(d4.mouse(target));

    d4_window.focus();
    d4_eventCancel();

    function mousemove() {
      moved = 1;
      translateTo(d4.mouse(target), l);
      dispatch(event_);
    }

    function mouseup() {
      if (moved) d4_eventCancel();
      w.on("mousemove.zoom", null).on("mouseup.zoom", null);
      if (moved && d4.event.target === eventTarget) d4_eventSuppress(w, "click.zoom");
    }
  }

  function mousewheel() {
    if (!translate0) translate0 = location(d4.mouse(this));
    scaleTo(Math.pow(2, d4_behavior_zoomDelta() * .002) * scale);
    translateTo(d4.mouse(this), translate0);
    dispatch(event.of(this, arguments));
  }

  function mousemove() {
    translate0 = null;
  }

  function dblclick() {
    var p = d4.mouse(this), l = location(p), k = Math.log(scale) / Math.LN2;
    scaleTo(Math.pow(2, d4.event.shiftKey ? Math.ceil(k) - 1 : Math.floor(k) + 1));
    translateTo(p, l);
    dispatch(event.of(this, arguments));
  }

  function touchstart() {
    var touches = d4.touches(this),
        now = Date.now();

    scale0 = scale;
    translate0 = {};
    touches.forEach(function(t) { translate0[t.identifier] = location(t); });
    d4_eventCancel();

    if (touches.length === 1) {
      if (now - touchtime < 500) { // dbltap
        var p = touches[0], l = location(touches[0]);
        scaleTo(scale * 2);
        translateTo(p, l);
        dispatch(event.of(this, arguments));
      }
      touchtime = now;
    }
  }

  function touchmove() {
    var touches = d4.touches(this),
        p0 = touches[0],
        l0 = translate0[p0.identifier];
    if (p1 = touches[1]) {
      var p1, l1 = translate0[p1.identifier];
      p0 = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      l0 = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
      scaleTo(d4.event.scale * scale0);
    }
    translateTo(p0, l0);
    touchtime = null;
    dispatch(event.of(this, arguments));
  }

  return d4.rebind(zoom, event, "on");
};

var d4_behavior_zoomInfinity = [0, Infinity]; // default scale extent

// https://developer.mozilla.org/en-US/docs/Mozilla_event_reference/wheel
var d4_behavior_zoomDelta, d4_behavior_zoomWheel
    = "onwheel" in d4_document ? (d4_behavior_zoomDelta = function() { return -d4.event.deltaY * (d4.event.deltaMode ? 120 : 1); }, "wheel")
    : "onmousewheel" in d4_document ? (d4_behavior_zoomDelta = function() { return d4.event.wheelDelta; }, "mousewheel")
    : (d4_behavior_zoomDelta = function() { return -d4.event.detail; }, "MozMousePixelScroll");
