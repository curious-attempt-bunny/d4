import "../color/lab";

d4.interpolateLab = d4_interpolateLab;

function d4_interpolateLab(a, b) {
  a = d4.lab(a);
  b = d4.lab(b);
  var al = a.l,
      aa = a.a,
      ab = a.b,
      bl = b.l - al,
      ba = b.a - aa,
      bb = b.b - ab;
  return function(t) {
    return d4_lab_rgb(al + bl * t, aa + ba * t, ab + bb * t) + "";
  };
}
