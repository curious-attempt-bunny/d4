import "../core/document";

try {
  d4_document.createElement("div").style.setProperty("opacity", 0, "");
} catch (error) {
  var d4_style_prototype = d4_window.CSSStyleDeclaration.prototype,
      d4_style_setProperty = d4_style_prototype.setProperty;
  d4_style_prototype.setProperty = function(name, value, priority) {
    d4_style_setProperty.call(this, name, value + "", priority);
  };
}
