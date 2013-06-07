import "../core/document";
import "xhr";

d4.html = function(url, callback) {
  return d4_xhr(url, "text/html", d4_html, callback);
};

function d4_html(request) {
  var range = d4_document.createRange();
  range.selectNode(d4_document.body);
  return range.createContextualFragment(request.responseText);
}
