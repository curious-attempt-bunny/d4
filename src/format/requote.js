d4.requote = function(s) {
  return s.replace(d4_requote_re, "\\$&");
};

var d4_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
