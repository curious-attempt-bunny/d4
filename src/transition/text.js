import "transition";
import "tween";

d4_transitionPrototype.text = function(value) {
  return d4_transition_tween(this, "text", value, d4_transition_text);
};

function d4_transition_text(b) {
  if (b == null) b = "";
  return function() { this.textContent = b; };
}
