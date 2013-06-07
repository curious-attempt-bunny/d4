import "../core/document";

d4.mouse = function(container) {
  return d4_mousePoint(container, d4_eventSource());
};

// https://bugs.webkit.org/show_bug.cgi?id=44083
var d4_mouse_bug44083 = /WebKit/.test(d4_window.navigator.userAgent) ? -1 : 0;

function d4_mousePoint(container, e) {
  var svg = container.ownerSVGElement || container;
  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    if (d4_mouse_bug44083 < 0 && (d4_window.scrollX || d4_window.scrollY)) {
      svg = d4.select(d4_document.body).append("svg")
          .style("position", "absolute")
          .style("top", 0)
          .style("left", 0);
      var ctm = svg[0][0].getScreenCTM();
      d4_mouse_bug44083 = !(ctm.f || ctm.e);
      svg.remove();
    }
    if (d4_mouse_bug44083) {
      point.x = e.pageX;
      point.y = e.pageY;
    } else {
      point.x = e.clientX;
      point.y = e.clientY;
    }
    point = point.matrixTransform(container.getScreenCTM().inverse());
    return [point.x, point.y];
  }
  var rect = container.getBoundingClientRect();
  return [e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop];
};
