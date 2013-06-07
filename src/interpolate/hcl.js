import "../color/hcl";

d4.interpolateHcl = d4_interpolateHcl;

function d4_interpolateHcl(a, b) {
  a = d4.hcl(a);
  b = d4.hcl(b);
  var ah = a.h,
      ac = a.c,
      al = a.l,
      bh = b.h - ah,
      bc = b.c - ac,
      bl = b.l - al;
  if (isNaN(bc)) bc = 0, ac = isNaN(ac) ? b.c : ac;
  if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah;
  else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360; // shortest path
  return function(t) {
    return d4_hcl_lab(ah + bh * t, ac + bc * t, al + bl * t) + "";
  };
}
