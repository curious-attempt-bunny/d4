import "../color/hsl";

d4.interpolateHsl = d4_interpolateHsl;

// interpolates HSL space, but outputs RGB string (for compatibility)

function d4_interpolateHsl(a, b) {
  a = d4.hsl(a);
  b = d4.hsl(b);
  var ah = a.h,
      as = a.s,
      al = a.l,
      bh = b.h - ah,
      bs = b.s - as,
      bl = b.l - al;
  if (isNaN(bs)) bs = 0, as = isNaN(as) ? b.s : as;
  if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah;
  else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360; // shortest path
  return function(t) {
    return d4_hsl_rgb(ah + bh * t, as + bs * t, al + bl * t) + "";
  };
}
