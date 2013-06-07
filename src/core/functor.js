function d4_functor(v) {
  return typeof v === "function" ? v : function() { return v; };
}

d4.functor = d4_functor;
